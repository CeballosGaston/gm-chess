import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useChessGame } from "./useChessGame";
import { supabase } from "@/lib/supabase";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(),
    removeChannel: vi.fn(),
  },
}));

describe("Feature: Chess Game Logic", () => {
  // 1. Creamos un Proxy/Mock que siempre se devuelve a sí mismo
  // Esto evita errores de ".eq() is not a function" o ".single() is not a function"
  const createMockChain = () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    };
    // Hacemos que select, update y eq siempre devuelvan el objeto 'chain'
    chain.select.mockReturnValue(chain);
    chain.update.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);
    return chain;
  };

  let mockChain: ReturnType<typeof createMockChain>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockChain = createMockChain();

    // Configuramos Supabase para usar nuestra cadena
    (supabase.from as Mock).mockReturnValue(mockChain);
    
    (supabase.channel as Mock).mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    });
  });

  it("Scenario: Loading an existing game", async () => {
    const mockData = { 
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", 
      turn: "b" 
    };

    // Configuramos el resultado específico de este test
    mockChain.single.mockResolvedValue({
      data: mockData,
      error: null,
      success: true,
    } as PostgrestSingleResponse<{ fen: string; turn: string }>);

    const { result } = renderHook(() => 
      useChessGame({ gameId: "game-123", playerColor: "w" })
    );

    // Verificamos que el estado inicial se carga correctamente
    await waitFor(() => {
      expect(result.current.fen).toBe(mockData.fen);
      expect(result.current.turn).toBe("b");
    }, { timeout: 2000 });
  });

  it("Scenario: Making a valid move", async () => {
    const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    
    // Al cargar el juego por primera vez
    mockChain.single.mockResolvedValueOnce({
      data: { fen: initialFen, turn: "w" },
      error: null,
      success: true,
    } as PostgrestSingleResponse<{ fen: string; turn: string }>);

    // Al hacer el update
    mockChain.single.mockResolvedValue({ data: null, error: null, success: true });

    const { result } = renderHook(() => 
      useChessGame({ gameId: "game-123", playerColor: "w" })
    );

    await waitFor(() => expect(result.current.turn).toBe("w"));

    let moveSuccess = false;
    await act(async () => {
      moveSuccess = await result.current.onDrop("e2", "e4");
    });

    expect(moveSuccess).toBe(true);
    expect(result.current.turn).toBe("b");
    
    // Verificamos las llamadas a la DB
    expect(mockChain.update).toHaveBeenCalledWith(
      expect.objectContaining({ turn: "b" })
    );
    expect(mockChain.eq).toHaveBeenCalledWith("id", "game-123");
  });
});