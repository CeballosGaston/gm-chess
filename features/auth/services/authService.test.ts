import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "./authService";
import { supabase } from "@/lib/supabase";

import { OAuthResponse, AuthError } from "@supabase/supabase-js";

// Mock de Supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock de window.location.origin
    Object.defineProperty(window, "location", {
      value: {
        origin: "http://localhost:3000",
      },
      writable: true,
      configurable: true,
    });
  });

  // Feature: Authentication Service

  /**
   * Scenario: Sign in with Google OAuth
   * Given the user wants to authenticate via Google
   * When the signIn method is called
   * Then it should return a valid OAuthResponse containing the provider and URL
   */
  it("Given a sign-in request, When signIn is called, Then it should call signInWithOAuth with correct parameters", async () => {
    const mockResponse: OAuthResponse = {
      data: {
        provider: "google",
        url: "https://google.com",
      },
      error: null,
    };

    vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue(mockResponse);

    const result = await authService.signIn();

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "gm-chess-taupe.vercel.app/auth/callback",
      },
    });
    expect(result).toEqual(mockResponse);
  });

  /**
   * Scenario: Successful sign out
   * Given an active session
   * When the signOut method is called
   * Then it should call the Supabase signOut method and resolve
   */
  it("Given an active session, When signOut is called and succeeds, Then it should call supabase.auth.signOut", async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    await expect(authService.signOut()).resolves.not.toThrow();
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  /**
   * Scenario: Failed sign out due to network or server error
   * Given a problem with the Supabase auth service
   * When the signOut method is called
   * Then it should throw a typed AuthError
   */
  it("Given a failure in Supabase, When signOut is called, Then it should throw the error returned by Supabase", async () => {
    const mockError = new AuthError("Sign out failed", 500);
    mockError.name = "AuthError";

    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: mockError,
    });

    await expect(authService.signOut()).rejects.toThrow("Sign out failed");
    await expect(authService.signOut()).rejects.toBeInstanceOf(AuthError);
  });
});
