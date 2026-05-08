import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { useChessGame } from "./useChessGame";

describe("useChessGame", () => {
  /**
   * GIVEN un nuevo juego de ajedrez
   * WHEN el hook se inicializa
   * THEN debería comenzar:
   * - con turno de blancas
   * - sin movimientos
   * - sin jaque
   * - sin jaque mate
   */
  it("should initialize a fresh chess game correctly", () => {
    const { result } = renderHook(() => useChessGame());

    expect(result.current.turn).toBe("w");
    expect(result.current.moves).toHaveLength(0);
    expect(result.current.isCheck).toBe(false);
    expect(result.current.isCheckmate).toBe(false);
    expect(result.current.isDraw).toBe(false);
  });

  /**
   * GIVEN una partida recién iniciada
   * WHEN las blancas juegan e2 -> e4
   * THEN:
   * - el movimiento debería ser válido
   * - el turno debería pasar a negras
   * - el historial debería registrar "e4"
   */
  it("should allow a valid move", async () => {
    const { result } = renderHook(() => useChessGame());

    await act(async () => {
      result.current.onDrop("e2", "e4");
    });

    expect(result.current.turn).toBe("b");
    expect(result.current.moves).toContain("e4");
  });

  /**
   * GIVEN una partida recién iniciada
   * WHEN un jugador intenta hacer un movimiento inválido
   * THEN:
   * - el movimiento debería ser rechazado
   * - el estado del juego NO debería cambiar
   * - el historial debería permanecer vacío
   */
  it("should reject an invalid move", () => {
    const { result } = renderHook(() => useChessGame());

    let moveResult = true;

    act(() => {
      // Movimiento inválido:
      // un peón no puede ir de e2 a e5 directamente
      moveResult = result.current.onDrop("e2", "e5");
    });

    expect(moveResult).toBe(false);
    expect(result.current.turn).toBe("w");
    expect(result.current.moves).toHaveLength(0);
  });

  /**
   * GIVEN una partida con movimientos realizados
   * WHEN el usuario reinicia la partida
   * THEN:
   * - el tablero debería volver al estado inicial
   * - el historial debería vaciarse
   * - el turno debería volver a blancas
   */
  it("should reset the game correctly", () => {
    const { result } = renderHook(() => useChessGame());

    act(() => {
      result.current.onDrop("e2", "e4");
    });

    expect(result.current.moves).toHaveLength(1);

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.moves).toHaveLength(0);
    expect(result.current.turn).toBe("w");
    expect(result.current.isCheck).toBe(false);
    expect(result.current.isCheckmate).toBe(false);
  });
});
