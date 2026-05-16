import { renderHook, waitFor, act } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type Mock,
} from "vitest";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useChessGame } from "./useChessGame";
import { supabase } from "@/lib/supabase";

import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import type { ReactNode } from "react";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(),
    removeChannel: vi.fn(),
  },
}));

vi.mock("@/features/auth/hooks/useUser", () => ({
  useUser: () => ({
    data: {
      id: "user-1",
      role: "white",
    },
  }),
}));

describe("Feature: Chess Game Logic", () => {
  const createMockChain = () => {
    const chain = {
      select: vi.fn(),
      update: vi.fn(),
      eq: vi.fn(),
      single: vi.fn(),
    };

    chain.select.mockReturnValue(chain);
    chain.update.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);

    return chain;
  };

  let mockChain: ReturnType<typeof createMockChain>;

  const createWrapper = () => {
    const queryClient = new QueryClient();

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
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockChain = createMockChain();

    (supabase.from as Mock).mockReturnValue(mockChain);

    (supabase.channel as Mock).mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    });
  });

  it("Scenario: Loading an existing game", async () => {
    const mockData = {
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
      turn: "b",
    };

    mockChain.single.mockResolvedValue({
      data: mockData,
      error: null,
    } as PostgrestSingleResponse<{
      fen: string;
      turn: string;
    }>);

    const { result } = renderHook(
      () =>
        useChessGame({
          gameId: "game-123",
          playerColor: "w",
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.fen).toBe(mockData.fen);
      expect(result.current.turn).toBe("b");
    });
  });

  it("Scenario: Making a valid move", async () => {
    const initialFen =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    mockChain.single.mockResolvedValueOnce({
      data: {
        fen: initialFen,
        turn: "w",
      },
      error: null,
    });

    mockChain.eq.mockResolvedValue({
      data: null,
      error: null,
    });

    const { result } = renderHook(
      () =>
        useChessGame({
          gameId: "game-123",
          playerColor: "w",
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.turn).toBe("w");
    });

    let moveSuccess = false;

    await act(async () => {
      moveSuccess = await result.current.onDrop("e2", "e4");
    });

    expect(moveSuccess).toBe(true);

    expect(result.current.turn).toBe("b");

    expect(mockChain.update).toHaveBeenCalledWith(
      expect.objectContaining({
        turn: "b",
      }),
    );

    expect(mockChain.eq).toHaveBeenCalledWith(
      "id",
      "game-123",
    );
  });
});