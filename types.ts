export interface TileType {
  id: string;
  name: string;
  url: string;
  category: 'Hills' | 'Rivers' | 'Trenches' | 'Plains' | 'Other Features';
}

export interface PlacedTile {
  tileId: string;
  rotation: number; // 0, 90, 180, 270
}

export type MapData = Record<string, PlacedTile>; // key format: "row,col"

export interface MapDimensions {
  width: number;
  height: number;
}