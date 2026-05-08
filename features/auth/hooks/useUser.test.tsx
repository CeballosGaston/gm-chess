import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUser } from "./useUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { profileService } from "../../marketplace/services/queries";
import { authService } from "../services/authService";
import { useRouter } from "next/navigation";
import React from "react";
// Importamos el tipo Profile (ajusta la ruta según tu proyecto)
import { Profile } from "../../../types/index";

// Mocks con tipado estricto
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

vi.mock("../../marketplace/services/queries", () => ({
  profileService: {
    getCurrentUser: vi.fn(),
  },
}));

vi.mock("../services/authService", () => ({
  authService: {
    signOut: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useUser Hook", () => {
  const createQueryClient = () =>
    new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });

  let queryClient = createQueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createQueryClient();

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      forward: vi.fn(),
      back: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });
  });

  // Feature: User Authentication and Profile Management

  /**
   * Scenario: Successfully fetching user data
   * Given a logged-in user exists with a complete profile
   * When the useUser hook is initialized
   * Then it should return the full Profile object
   */
  it("Given a logged-in user, When the hook is initialized, Then it should fetch and return the user profile", async () => {
    // Creamos un mock que cumpla estrictamente con la interfaz Profile
    const mockUser: Profile = {
      id: "123",
      name: "John Doe",
      avatar_url: "https://example.com/photo.png",
      role: "gm",
      title: "GM",

      bio: "",
      elo: 2800,
      rating_avg: 4,
      languages: ["spanish"],
      is_available: false,
      created_at: new Date().toISOString(),
    };

    vi.mocked(profileService.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockUser);
  });

  /**
   * Scenario: User initiates logout
   * Given an authenticated session is active
   * When the logout function is invoked
   * Then it should sign out and redirect
   */
  it("Given an active session, When the logout function is called, Then it should sign out, clear cache, and redirect to login", async () => {
    const mockUser: Profile = {
      id: "123",
      name: "John Doe",
      avatar_url: "https://example.com/photo.png",
      role: "gm",
      title: "GM",

      bio: "",
      elo: 2800,
      rating_avg: 4,
      languages: ["spanish"],
      is_available: false,
      created_at: new Date().toISOString(),
    };
    queryClient.setQueryData(["currentUser"], mockUser);
    vi.mocked(authService.signOut).mockResolvedValue(undefined);

    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(authService.signOut).toHaveBeenCalled();
    await waitFor(() => {
      const cachedData = queryClient.getQueryData(["currentUser"]);
      expect(cachedData).toBeNull();
    });
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  /**
   * Scenario: Auth state synchronization
   * When Supabase triggers SIGNED_IN event
   * Then the query cache should be invalidated
   */
  it("Given the auth state changes, When Supabase triggers SIGNED_IN, Then the currentUser query should be invalidated", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const onAuthStateChangeMock = vi.mocked(supabase.auth.onAuthStateChange);

    renderHook(() => useUser(), { wrapper });

    const callback = onAuthStateChangeMock.mock.calls[0][0];

    act(() => {
      callback("SIGNED_IN", null);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["currentUser"] });
  });
});
