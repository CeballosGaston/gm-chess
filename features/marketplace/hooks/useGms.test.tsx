import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGms } from "./useGms";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { profileService } from "../services/queries";
import { Profile } from "../../../types/index";
import React from "react";

// Mock
vi.mock("../services/queries", () => ({
  profileService: {
    getGMs: vi.fn(),
  },
}));

describe("useGms Hook", () => {
  const createQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

  let queryClient = createQueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createQueryClient();
  });

  // Feature: Grandmasters Marketplace

  /**
   * Scenario: Successfully retrieving the list of Grandmasters
   * Given the marketplace has available Grandmasters
   * When the useGms hook is called
   * Then it should return a list of profiles from the profileService
   */
  it("Given available GMs, When the hook is invoked, Then it should fetch and return the list of GMs", async () => {
    const mockGms: Profile[] = [
      {
        id: "gm-1",
        name: "Magnus Carlsen",
        avatar_url: "https://example.com/magnus.png",
        role: "gm",
        title: "GM",
        bio: "World Champion",
        created_at: new Date().toISOString(),
        elo: 2850,
        rating_avg: 5,
        is_available: true,
        languages: ["english", "norwegian"],
      },
    ];

    vi.mocked(profileService.getGMs).mockResolvedValue(mockGms);

    const { result } = renderHook(() => useGms(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

   
    expect(result.current.data).toEqual(mockGms);
    expect(result.current.data).toHaveLength(1);
    expect(profileService.getGMs).toHaveBeenCalledTimes(1);
  });

  /**
   * Scenario: Handling an error during GM fetch
   * Given the profile service fails to respond
   * When the useGms hook is invoked
   * Then it should return an error status
   */
  it("Given a service failure, When the hook is invoked, Then it should return an error state", async () => {
    const mockError = new Error("Failed to fetch GMs");
    vi.mocked(profileService.getGMs).mockRejectedValue(mockError);

    const { result } = renderHook(() => useGms(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
  });
});
