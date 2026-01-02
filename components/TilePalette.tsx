import React, { useState } from 'react';
import { AVAILABLE_TILES } from '../constants';
import { TileType } from '../types';

interface TilePaletteProps {
  selectedTileId: string | null;
  onSelectTile: (tileId: string) => void;
}

const TilePalette: React.FC<TilePaletteProps> = ({ selectedTileId, onSelectTile }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'Hills', 'Rivers', 'Trenches', 'Plains', 'Other Features'];

  const filteredTiles = activeCategory === 'All' 
    ? AVAILABLE_TILES 
    : AVAILABLE_TILES.filter(t => t.category === activeCategory as any);

  return (
    <div className="flex flex-col h-full bg-black border-r border-orange-500/20 w-80 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Survey Assets
          </h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded text-[9px] font-black tracking-widest uppercase transition-all border ${
                activeCategory === cat 
                  ? 'bg-orange-600 text-white border-orange-400' 
                  : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <div className="grid grid-cols-2 gap-3">
          {filteredTiles.map(tile => (
            <button
              key={tile.id}
              onClick={() => onSelectTile(tile.id)}
              className={`group relative aspect-square rounded overflow-hidden border transition-all ${
                selectedTileId === tile.id 
                  ? 'border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.2)]' 
                  : 'border-zinc-800 hover:border-orange-500/50'
              }`}
            >
              <img 
                src={tile.url} 
                alt={tile.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-[9px] font-black uppercase tracking-tighter text-white truncate w-full">
                  {tile.name}
                </span>
              </div>
              {selectedTileId === tile.id && (
                <div className="absolute top-0 right-0 bg-orange-500 text-black px-1.5 py-0.5 rounded-bl font-black text-[8px]">
                  ACTIVE
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-zinc-950 border-t border-zinc-800">
         <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest flex justify-between">
            <span>System Status</span>
            <span className="text-orange-500">Online</span>
         </div>
      </div>
    </div>
  );
};

export default TilePalette;