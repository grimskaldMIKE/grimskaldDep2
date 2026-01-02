import { TileType } from './types';

export const TILE_SIZE = 256;

export const AVAILABLE_TILES: TileType[] = [
  // Plains
  { id: 'plain-flat', name: 'flatTile', url: 'flatTile.png', category: 'Plains' },
  { id: 'plain-open1', name: 'openTile1', url: 'openTile1.png', category: 'Plains' },
  { id: 'plain-open2', name: 'openTile2', url: 'openTile2.png', category: 'Plains' },
  { id: 'plain-open3', name: 'openTile3', url: 'openTile3.png', category: 'Plains' },

  // Hills
  { id: 'hill-1', name: 'hillTile1', url: 'hillTile1.png', category: 'Hills' },
  { id: 'hill-2', name: 'hillTile2', url: 'hillTile2.png', category: 'Hills' },
  { id: 'hill-3', name: 'hillTile3', url: 'hillTile3.png', category: 'Hills' },
  { id: 'hill-edge-1', name: 'multiPartHillEdge1', url: 'multiPartHillEdge1.png', category: 'Hills' },
  { id: 'hill-edge-2', name: 'multiPartHillEdge2', url: 'multiPartHillEdge2.png', category: 'Hills' },
  { id: 'hill-int-corner', name: 'multiPartHillInternalCorner', url: 'multiPartHillInternalCorner.png', category: 'Hills' },
  { id: 'hill-part-1', name: 'multiPartHillTile1', url: 'multiPartHillTile1.png', category: 'Hills' },
  { id: 'hill-part-2', name: 'multiPartHillTile2', url: 'multiPartHillTile2.png', category: 'Hills' },
  { id: 'hill-part-3', name: 'multiPartHillTile3', url: 'multiPartHillTile3.png', category: 'Hills' },
  { id: 'hill-part-4', name: 'multiPartHillTile4', url: 'multiPartHillTile4.png', category: 'Hills' },
  { id: 'hill-part-5', name: 'multiPartHillTile5', url: 'multiPartHillTile5.png', category: 'Hills' },
  { id: 'hill-part-6', name: 'multiPartHillTile6', url: 'multiPartHillTile6.png', category: 'Hills' },

  // Rivers
  { id: 'river-straight-1', name: 'riverStraightTile1', url: 'riverStraightTile1.png', category: 'Rivers' },
  { id: 'river-straight-2', name: 'riverStraightTile2', url: 'riverStraightTile2.png', category: 'Rivers' },
  { id: 'river-straight-3', name: 'riverStraightTile3', url: 'riverStraightTile3.png', category: 'Rivers' },
  { id: 'river-corner-1', name: 'riverCornerTile1', url: 'riverCornerTile1.png', category: 'Rivers' },
  { id: 'river-corner-2', name: 'riverCornerTile2', url: 'riverCornerTile2.png', category: 'Rivers' },
  { id: 'river-corner-3', name: 'riverCornerTile3', url: 'riverCornerTile3.png', category: 'Rivers' },
  { id: 'river-fork-1', name: 'riverForkTile1', url: 'riverForkTile1.png', category: 'Rivers' },
  { id: 'river-fork-2', name: 'riverForkTile2', url: 'riverForkTile2.png', category: 'Rivers' },

  // Trenches
  { id: 'trench-straight', name: 'trenchStraight', url: 'trenchStraight.png', category: 'Trenches' },
  { id: 'trench-corner', name: 'trenchCorner', url: 'trenchCorner.png', category: 'Trenches' },
  { id: 'trench-rounded', name: 'trenchRoundedCorner', url: 'trenchRoundedCorner.png', category: 'Trenches' },
  { id: 'trench-t', name: 'trenchTJunction', url: 'trenchTJunction.png', category: 'Trenches' },

  // Other Features (formerly Water Features) & Craters
  { id: 'crater-1', name: 'craterTile1', url: 'craterTile1.png', category: 'Other Features' },
  { id: 'crater-2', name: 'craterTile2', url: 'craterTile2.png', category: 'Other Features' },
  { id: 'crater-3', name: 'craterTile3', url: 'craterTile3.png', category: 'Other Features' },
  { id: 'crater-4', name: 'craterTile4', url: 'craterTile4.png', category: 'Other Features' },
  { id: 'water-1', name: 'waterFeatureTile1', url: 'waterFeatureTile1.png', category: 'Other Features' },
  { id: 'water-2', name: 'waterFeatureTile2', url: 'waterFeatureTile2.png', category: 'Other Features' },
  { id: 'water-3', name: 'waterFeatureTile3', url: 'waterFeatureTile3.png', category: 'Other Features' },
];