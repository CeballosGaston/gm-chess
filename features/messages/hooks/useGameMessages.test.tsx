

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";

import { useGameMessages } from "./useGameMessages";


const mocks = vi.hoisted(() => {
  return {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),

    insert: vi.fn(),

    subscribe: vi.fn(),
    on: vi.fn(),

    removeChannel: vi.fn(),
    channel: vi.fn(),
  };
});


vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mocks.select,
      insert: mocks.insert,
    })),

    channel: mocks.channel,

    removeChannel: mocks.removeChannel,
  },
}));



function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({
    children,
  }: {
    children: ReactNode;
  }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}



describe("Feature: Game Messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.select.mockReturnValue({
      eq: mocks.eq,
    });

    mocks.eq.mockReturnValue({
      order: mocks.order,
    });

    mocks.order.mockResolvedValue({
      data: [
        {
          id: "msg-1",
          game_id: "game-1",
          sender_id: "gm-1",
          content: "Excelente jugada",
          created_at: "2026-01-01",
        },
      ],
      error: null,
    });

    mocks.on.mockReturnValue({
      subscribe: mocks.subscribe,
    });

    mocks.channel.mockReturnValue({
      on: mocks.on,
    });

    mocks.subscribe.mockReturnValue({});
  });

  // =========================================
  // GIVEN existing messages
  // WHEN the hook loads
  // THEN it should fetch game messages
  // =========================================
  it("Given existing messages, When the hook loads, Then it should fetch game messages", async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useGameMessages("game-1"),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.messages.length).toBe(1);
    });

    expect(mocks.select).toHaveBeenCalledWith("*");

    expect(mocks.eq).toHaveBeenCalledWith(
      "game_id",
      "game-1"
    );

    expect(mocks.order).toHaveBeenCalledWith(
      "created_at",
      {
        ascending: true,
      }
    );
  });

  // =========================================
  // GIVEN realtime is enabled
  // WHEN the hook mounts
  // THEN it should subscribe to realtime updates
  // =========================================
  it("Given realtime is enabled, When the hook mounts, Then it should subscribe to realtime updates", async () => {
    const wrapper = createWrapper();

    renderHook(() => useGameMessages("game-1"), {
      wrapper,
    });

    await waitFor(() => {
      expect(mocks.channel).toHaveBeenCalledWith(
        "messages-game-1"
      );
    });

    expect(mocks.on).toHaveBeenCalled();

    expect(mocks.subscribe).toHaveBeenCalled();
  });

  // =========================================
  // GIVEN a GM sends a message
  // WHEN sendMessage is called
  // THEN it should insert the message
  // =========================================
  it("Given a GM sends a message, When sendMessage is called, Then it should insert the message", async () => {
    const wrapper = createWrapper();

    mocks.insert.mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(
      () => useGameMessages("game-1"),
      {
        wrapper,
      }
    );

    await result.current.sendMessage(
      "Muy buena combinación táctica"
    );

    expect(mocks.insert).toHaveBeenCalledWith({
      game_id: "game-1",
      content: "Muy buena combinación táctica",
    });
  });

  // =========================================
  // GIVEN the component unmounts
  // WHEN realtime exists
  // THEN it should cleanup the channel
  // =========================================
  it("Given the component unmounts, When realtime exists, Then it should cleanup the channel", async () => {
    const wrapper = createWrapper();

    const { unmount } = renderHook(
      () => useGameMessages("game-1"),
      {
        wrapper,
      }
    );

    unmount();

    expect(mocks.removeChannel).toHaveBeenCalled();
  });
});