import React, { useState } from 'react';
import { AVAILABLE_TILES } from '../constants';

interface TilePaletteProps {
  selectedTileId: string | null;
  onSelectTile: (tileId: string) => void;
}

const TilePalette: React.FC<TilePaletteProps> = ({ 
  selectedTileId, 
  onSelectTile,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Hills', 'Rivers', 'Trenches', 'Plains', 'Other Features'];
  const filteredTiles = activeCategory === 'All' 
    ? AVAILABLE_TILES 
    : AVAILABLE_TILES.filter(t => t.category === activeCategory as any);

  return (
    <div className="flex flex-col h-full bg-black border-r border-orange-500/20 w-80 shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-20">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
            Survey Assets
          </h2>
        </div>

        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-1 rounded text-[8px] font-black tracking-widest uppercase transition-all border ${
                activeCategory === cat 
                  ? 'bg-orange-600 text-black border-orange-400' 
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTiles.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center opacity-20 text-center">
            <i className="fas fa-ghost text-2xl mb-2"></i>
            <span className="text-[8px] font-black uppercase tracking-widest">No assets in spectrum</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {filteredTiles.map(tile => (
            <div key={tile.id} className="relative group">
              <button
                onClick={() => onSelectTile(tile.id)}
                className={`w-full relative aspect-square rounded bg-zinc-900 overflow-hidden border transition-all ${
                  selectedTileId === tile.id 
                    ? 'border-orange-500 ring-1 ring-orange-500/50' 
                    : 'border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <img 
                  src={tile.url} 
                  alt={tile.name} 
                  className={`w-full h-full object-cover transition-all duration-700 ${selectedTileId === tile.id ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/256/000/ea580c?text=SIGNAL_LOSS'; }}
                />
                
                <div className="absolute inset-x-0 bottom-0 bg-black/80 p-1 transform translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center px-2">
                  <div className="text-[7px] font-black text-white truncate text-center flex-1 uppercase tracking-tighter">{tile.name}</div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TilePalette;