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
  /**
   * SELECT chain:
   * supabase
   *   .from()
   *   .select()
   *   .eq()
   *   .single()
   */
  const createSelectChain = () => {
    const chain = {
      select: vi.fn(),
      eq: vi.fn(),
      single: vi.fn(),
    };

    chain.select.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);

    return chain;
  };

  /**
   * UPDATE chain:
   * supabase
   *   .from()
   *   .update()
   *   .eq()
   */
  const createUpdateChain = () => {
    const chain = {
      update: vi.fn(),
      eq: vi.fn(),
    };

    chain.update.mockReturnValue(chain);

    return chain;
  };

  let selectChain: ReturnType<typeof createSelectChain>;
  let updateChain: ReturnType<typeof createUpdateChain>;

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

    selectChain = createSelectChain();
    updateChain = createUpdateChain();

    /**
     * IMPORTANT:
     * We return different chains depending on whether
     * the code is performing SELECT or UPDATE operations.
     */
    (supabase.from as Mock).mockImplementation(() => ({
      select: selectChain.select,
      update: updateChain.update,
    }));

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

    selectChain.single.mockResolvedValue({
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

    expect(selectChain.select).toHaveBeenCalled();
    expect(selectChain.eq).toHaveBeenCalledWith(
      "id",
      "game-123",
    );
    expect(selectChain.single).toHaveBeenCalled();
  });

  it("Scenario: Making a valid move", async () => {
    const initialFen =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    selectChain.single.mockResolvedValueOnce({
      data: {
        fen: initialFen,
        turn: "w",
      },
      error: null,
    });

    updateChain.eq.mockResolvedValue({
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

    expect(updateChain.update).toHaveBeenCalledWith(
      expect.objectContaining({
        turn: "b",
      }),
    );

    expect(updateChain.eq).toHaveBeenCalledWith(
      "id",
      "game-123",
    );
  });
});