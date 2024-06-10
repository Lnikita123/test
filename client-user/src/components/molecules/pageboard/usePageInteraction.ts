export type Brush = {
  position: string;
  color: string;
  _id?: string;
};

export type ScreenZ = {
  position: string;
  color: string;
  animate: boolean;
  _id?: string;
};

export type ArrowPercentage = {
  start: { x: number; y: number };
  end: { x: number; y: number };
  color: string;
  _id?: string;
};

export type LinePercentage = {
  start: { x: number; y: number };
  end: { x: number; y: number };
  color: string;
  _id?: string;
};

export type Piece = {
  location: string;
  pieceName: string;
};
