import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Mock } from "vitest";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn((url: URL | string) => ({
      url: url.toString(),
      status: 302,
    })),
  },
}));

describe("Auth Callback Route", () => {
  const origin = "https://gm-chess-taupe.vercel.app";

  beforeEach(() => {
    vi.clearAllMocks();

    process.env.NEXT_PUBLIC_SUPABASE_URL =
      "https://test.supabase.co";

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
      "test-key";
  });

  it("should redirect to home when code exchange succeeds", async () => {
    // GIVEN
    const code = "test-code";

    const request = new Request(
      `${origin}/auth/callback?code=${code}`
    );

    const mockCookieStore = {
      getAll: vi.fn(),
      set: vi.fn(),
    };

    (cookies as Mock).mockResolvedValue(mockCookieStore);

    const mockExchangeCode = vi.fn().mockResolvedValue({
      error: null,
    });

    (createServerClient as Mock).mockReturnValue({
      auth: {
        exchangeCodeForSession: mockExchangeCode,
      },
    });

    // WHEN
    await GET(request);

    // THEN
    expect(mockExchangeCode).toHaveBeenCalledWith(code);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: `${origin}/`,
      })
    );
  });

  it("should redirect to login error when code is missing", async () => {
    // GIVEN
    const request = new Request(
      `${origin}/auth/callback`
    );

    // WHEN
    await GET(request);

    // THEN
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: `${origin}/login?error=callback_failed`,
      })
    );
  });
});