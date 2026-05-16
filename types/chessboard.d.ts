
import { Square } from 'chess.js';

declare module 'react-chessboard' {
  export interface ChessboardProps {
    id?: string | number;
    position?: string;
    onPieceDrop?: (sourceSquare: Square, targetSquare: Square) => boolean;
    boardOrientation?: 'white' | 'black';
    customDarkSquareStyle?: React.CSSProperties;
    customLightSquareStyle?: React.CSSProperties;
    animationDuration?: number;
    boardWidth?: number;
   
  }
  export const Chessboard: React.FC<ChessboardProps>;
}