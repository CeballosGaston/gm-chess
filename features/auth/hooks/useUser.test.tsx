import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import React from "react";

import { useUser } from "./useUser";

import { profileService } from "../../marketplace/services/queries";

import type { Profile } from "@/types";

vi.mock("../../marketplace/services/queries", () => ({
  profileService: {
    getCurrentUser: vi.fn(),
  },
}));

describe("useUser Hook", () => {
  const createQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();

    queryClient = createQueryClient();
  });

  const wrapper = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  /**
   * Scenario: Successfully fetching user data
   * Given a logged-in user exists with a complete profile
   * When the useUser hook is initialized
   * Then it should return the full Profile object
   */
  it("Given a logged-in user, When the hook is initialized, Then it should fetch and return the user profile", async () => {
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

    vi.mocked(profileService.getCurrentUser)
      .mockResolvedValue(mockUser);

    const { result } = renderHook(
      () => useUser(),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(profileService.getCurrentUser)
      .toHaveBeenCalledTimes(1);

    expect(result.current.data).toEqual(mockUser);
  });

  /**
   * Scenario: No authenticated user
   * Given no authenticated session exists
   * When the hook loads
   * Then it should return null user data
   */
  it("Given no authenticated user, When the hook loads, Then it should return null", async () => {
    vi.mocked(profileService.getCurrentUser)
      .mockResolvedValue(null);

    const { result } = renderHook(
      () => useUser(),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });

  /**
   * Scenario: Service throws an error
   * Given the profile service fails
   * When the hook fetches the user
   * Then it should expose an error state
   */
  it("Given the service fails, When the hook fetches the user, Then it should expose an error state", async () => {
    vi.mocked(profileService.getCurrentUser)
      .mockRejectedValue(new Error("Failed to fetch user"));

    const { result } = renderHook(
      () => useUser(),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);

    expect(result.current.error?.message)
      .toBe("Failed to fetch user");
  });
});