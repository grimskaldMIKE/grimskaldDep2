import React from 'react';
import { MapDimensions } from '../types';

interface ControlPanelProps {
  dimensions: MapDimensions;
  setDimensions: (dims: MapDimensions) => void;
  onClear: () => void;
  onGenerateLore: () => void;
  onExport: () => void;
  zoom: number;
  setZoom: (z: number) => void;
  onFit: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  dimensions, 
  setDimensions, 
  onClear, 
  onGenerateLore,
  onExport,
  zoom,
  setZoom,
  onFit
}) => {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="h-16 bg-black border-b border-orange-500/30 px-6 flex items-center justify-between z-10 shadow-[0_4px_20px_rgba(234,88,12,0.15)]">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-black tracking-tighter text-orange-500 italic">GRIMFIELDS BATTLEFIELD BUILDER</h1>
        
        <div className="flex items-center gap-4 bg-zinc-900 p-1 rounded border border-zinc-800">
          <div className="flex items-center gap-2 px-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">W</span>
            <input 
              type="number" 
              min="1" 
              max="50"
              value={dimensions.width}
              onChange={(e) => setDimensions({...dimensions, width: parseInt(e.target.value) || 1})}
              className="w-12 bg-black text-white text-center rounded text-sm py-1 focus:ring-1 ring-orange-500 outline-none border border-zinc-700"
            />
          </div>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2 px-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">H</span>
            <input 
              type="number" 
              min="1" 
              max="50"
              value={dimensions.height}
              onChange={(e) => setDimensions({...dimensions, height: parseInt(e.target.value) || 1})}
              className="w-12 bg-black text-white text-center rounded text-sm py-1 focus:ring-1 ring-orange-500 outline-none border border-zinc-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded border border-zinc-800 ml-2">
          <button 
            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
            className="w-8 h-8 flex items-center justify-center hover:bg-orange-500 hover:text-white rounded text-zinc-400 transition-colors"
            title="Zoom Out"
          >
            <i className="fas fa-minus text-[10px]"></i>
          </button>
          <button 
            onClick={onFit}
            className="px-3 h-8 flex items-center justify-center hover:text-orange-400 rounded text-white text-xs font-mono min-w-[60px]"
            title="Reset Zoom / Fit to Screen"
          >
            {zoomPercent}%
          </button>
          <button 
            onClick={() => setZoom(Math.min(2.0, zoom + 0.1))}
            className="w-8 h-8 flex items-center justify-center hover:bg-orange-500 hover:text-white rounded text-zinc-400 transition-colors"
            title="Zoom In"
          >
            <i className="fas fa-plus text-[10px]"></i>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded border border-zinc-800">
           <button 
            onClick={onExport}
            className="px-4 py-1.5 hover:text-white rounded text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
            title="Download Map Manifest (.json)"
          >
            <i className="fas fa-download mr-2"></i>
            Export
          </button>
        </div>

        <div className="w-px h-6 bg-zinc-800 mx-1" />

        <button 
          onClick={onGenerateLore}
          className="flex items-center gap-2 px-6 py-2 rounded text-xs font-black uppercase tracking-widest transition-all bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.3)] border border-orange-400"
        >
          <i className="fas fa-chart-simple"></i>
          Analyze Terrain
        </button>

        <div className="w-px h-6 bg-zinc-800 mx-1" />

        <button 
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 hover:text-white rounded text-xs font-bold transition-colors text-zinc-500 border border-transparent hover:border-zinc-700"
        >
          <i className="fas fa-bolt-lightning"></i>
          Flush Buffer
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;