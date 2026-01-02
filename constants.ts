import { TileType } from './types';

export const TILE_SIZE = 256;

export const AVAILABLE_TILES: TileType[] = [
  // Plains
  { id: 'plain-flat', name: 'flatTile', url: 'http://localhost:3000/flatTile.png', category: 'Plains' },
  { id: 'plain-open1', name: 'openTile1', url: 'openTile1.png', category: 'Plains' },
  { id: 'plain-open2', name: 'openTile2', url: 'openTile2.png', category: 'Plains' },

  // Hills
  { id: 'hill-1', name: 'hillTile1', url: 'hillTile1.png', category: 'Hills' },
  { id: 'hill-2', name: 'hillTile2', url: 'hillTile2.png', category: 'Hills' },
  { id: 'hill-edge', name: 'hillEdge', url: 'hillEdge.png', category: 'Hills' },

  // Rivers
  { id: 'river-straight', name: 'riverStraight', url: 'riverStraight.png', category: 'Rivers' },
  { id: 'river-corner', name: 'riverCorner', url: 'riverCorner.png', category: 'Rivers' },

  // Trenches
  { id: 'trench-straight', name: 'trenchStraight', url: 'trenchStraight.png', category: 'Trenches' },
  { id: 'trench-corner', name: 'trenchCorner', url: 'trenchCorner.png', category: 'Trenches' },

  // Other Features
  { id: 'crater-1', name: 'craterTile', url: 'craterTile.png', category: 'Other Features' },
  { id: 'water-1', name: 'waterFeature', url: 'waterFeature.png', category: 'Other Features' },
];