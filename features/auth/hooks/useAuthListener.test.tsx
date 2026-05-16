import { renderHook } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type Mock,
} from "vitest";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import React from "react";

import { useAuthListener } from "./useAuthListener";

import { supabase } from "@/lib/supabase";

type AuthChangeCallback = (
  event: "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED",
) => void;

const unsubscribeMock = vi.fn();

const onAuthStateChangeMock = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(),
    },
  },
}));

describe("Feature: Authentication State Synchronization", () => {
  let queryClient: QueryClient;

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

    (supabase.auth.onAuthStateChange as Mock).mockImplementation(
      (callback: AuthChangeCallback) => {
        onAuthStateChangeMock.mockImplementation(callback);

        return {
          data: {
            subscription: {
              unsubscribe: unsubscribeMock,
            },
          },
        };
      },
    );
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
   * Scenario: Invalidating current user on SIGNED_IN
   * Given the auth listener is active
   * When Supabase emits a SIGNED_IN event
   * Then the currentUser query should be invalidated
   */
  it("Given the auth listener is active, When SIGNED_IN occurs, Then currentUser should be invalidated", () => {
    const invalidateSpy = vi.spyOn(
      queryClient,
      "invalidateQueries",
    );

    renderHook(() => useAuthListener(), {
      wrapper,
    });

    onAuthStateChangeMock("SIGNED_IN");

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["currentUser"],
    });
  });

  /**
   * Scenario: Invalidating current user on SIGNED_OUT
   * Given the auth listener is active
   * When Supabase emits a SIGNED_OUT event
   * Then the currentUser query should be invalidated
   */
  it("Given the auth listener is active, When SIGNED_OUT occurs, Then currentUser should be invalidated", () => {
    const invalidateSpy = vi.spyOn(
      queryClient,
      "invalidateQueries",
    );

    renderHook(() => useAuthListener(), {
      wrapper,
    });

    onAuthStateChangeMock("SIGNED_OUT");

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["currentUser"],
    });
  });

  /**
   * Scenario: Ignoring unrelated auth events
   * Given the auth listener is active
   * When Supabase emits TOKEN_REFRESHED
   * Then no query invalidation should happen
   */
  it("Given the auth listener is active, When TOKEN_REFRESHED occurs, Then no invalidation should happen", () => {
    const invalidateSpy = vi.spyOn(
      queryClient,
      "invalidateQueries",
    );

    renderHook(() => useAuthListener(), {
      wrapper,
    });

    onAuthStateChangeMock("TOKEN_REFRESHED");

    expect(invalidateSpy).not.toHaveBeenCalled();
  });

  /**
   * Scenario: Cleaning up auth subscription
   * Given the auth listener is mounted
   * When the hook unmounts
   * Then the subscription should be unsubscribed
   */
  it("Given the listener is mounted, When the hook unmounts, Then it should unsubscribe", () => {
    const { unmount } = renderHook(
      () => useAuthListener(),
      {
        wrapper,
      },
    );

    unmount();

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });
});