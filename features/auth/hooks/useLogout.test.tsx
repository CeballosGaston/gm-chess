import { renderHook, act, waitFor } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import React from "react";

import { useLogout } from "./useLogout";

import { authService } from "../services/authService";

import { useRouter } from "next/navigation";

vi.mock("../services/authService", () => ({
  authService: {
    signOut: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("Feature: User Logout Flow", () => {
  let queryClient: QueryClient;

  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    vi.mocked(useRouter).mockReturnValue({
      push: pushMock,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    });
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
   * Scenario: Successful logout
   * Given an authenticated user exists
   * When logout is executed
   * Then the session should close, cache should clear, and redirect should occur
   */
  it("Given an authenticated user, When logout executes, Then cache is cleared and user is redirected", async () => {
    vi.mocked(authService.signOut)
      .mockResolvedValue(undefined);

    queryClient.setQueryData(
      ["currentUser"],
      {
        id: "user-1",
      },
    );

    const { result } = renderHook(
      () => useLogout(),
      {
        wrapper,
      },
    );

    await act(async () => {
      await result.current.logout();
    });

    expect(authService.signOut)
      .toHaveBeenCalledTimes(1);

    expect(
      queryClient.getQueryData(["currentUser"]),
    ).toBeNull();

    expect(pushMock)
      .toHaveBeenCalledWith("/login");
  });

  /**
   * Scenario: Logout service failure
   * Given the auth service fails
   * When logout is executed
   * Then the error should be handled without crashing
   */
  it("Given signOut fails, When logout executes, Then the error should be handled gracefully", async () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const error = new Error("Logout failed");

    vi.mocked(authService.signOut)
      .mockRejectedValue(error);

    const { result } = renderHook(
      () => useLogout(),
      {
        wrapper,
      },
    );

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error al salir:",
        error,
      );
    });

    expect(pushMock)
      .not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});