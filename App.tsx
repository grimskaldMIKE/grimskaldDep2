import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { TILE_SIZE, AVAILABLE_TILES } from './constants';
import { MapData, MapDimensions, PlacedTile } from './types';
import TilePalette from './components/TilePalette';
import ControlPanel from './components/ControlPanel';

const App: React.FC = () => {
  const [dimensions, setDimensions] = useState<MapDimensions>({ width: 10, height: 10 });
  const [mapData, setMapData] = useState<MapData>({});
  const [selectedTileId, setSelectedTileId] = useState<string | null>(AVAILABLE_TILES[0].id);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [zoom, setZoom] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tileStats = useMemo(() => {
    const counts: Record<string, number> = {};
    (Object.values(mapData) as PlacedTile[]).forEach(pt => {
      const tile = AVAILABLE_TILES.find(t => t.id === pt.tileId);
      if (tile) {
        counts[tile.name] = (counts[tile.name] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [mapData]);

  const handleFitToScreen = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const padding = 128; 
    const availableWidth = container.clientWidth - padding;
    const availableHeight = container.clientHeight - padding;
    const mapPixelWidth = dimensions.width * TILE_SIZE;
    const mapPixelHeight = dimensions.height * TILE_SIZE;
    const zoomW = availableWidth / mapPixelWidth;
    const zoomH = availableHeight / mapPixelHeight;
    const newZoom = Math.min(zoomW, zoomH, 1.0);
    setZoom(parseFloat(newZoom.toFixed(2)));
  }, [dimensions]);

  useEffect(() => {
    handleFitToScreen();
  }, [dimensions, handleFitToScreen]);

  const handleTileClick = (row: number, col: number) => {
    const key = `${row},${col}`;
    const existing = mapData[key];
    if (existing && existing.tileId === selectedTileId) {
      setMapData(prev => ({
        ...prev,
        [key]: { ...existing, rotation: (existing.rotation + 90) % 360 }
      }));
    } else if (selectedTileId) {
      setMapData(prev => ({
        ...prev,
        [key]: { tileId: selectedTileId, rotation: 0 }
      }));
    }
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    const key = `${row},${col}`;
    if (mapData[key]) {
      const newMap = { ...mapData };
      delete newMap[key];
      setMapData(newMap);
    }
  };

  const clearMap = () => {
    if (window.confirm("CRITICAL: CONFIRM DATA PURGE?")) {
      setMapData({});
      setShowAnalysis(false);
    }
  };

  const handleShowAnalysis = () => {
    if (Object.keys(mapData).length === 0) {
      alert("ERROR: INPUT BUFFER EMPTY. PLOT CO-ORDINATES BEFORE ANALYSIS.");
      return;
    }
    setShowAnalysis(!showAnalysis);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(prev => Math.min(2.0, Math.max(0.1, prev + delta)));
    }
  };

  const exportMap = () => {
    const data = JSON.stringify({ dimensions, mapData }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grimfields_map_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans text-white bg-black">
      <ControlPanel 
        dimensions={dimensions} 
        setDimensions={setDimensions} 
        onClear={clearMap}
        onExport={exportMap}
        onGenerateLore={handleShowAnalysis}
        zoom={zoom}
        setZoom={setZoom}
        onFit={handleFitToScreen}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <TilePalette 
          selectedTileId={selectedTileId} 
          onSelectTile={setSelectedTileId} 
        />

        <main 
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="flex-1 overflow-auto bg-[#050505] p-24 flex justify-start items-start relative select-none cursor-crosshair"
        >
          <div 
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${dimensions.width}, ${TILE_SIZE}px)`,
                gridTemplateRows: `repeat(${dimensions.height}, ${TILE_SIZE}px)`,
                width: dimensions.width * TILE_SIZE,
                height: dimensions.height * TILE_SIZE,
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                transition: 'transform 0.1s ease-out',
            }} 
            className="grid-canvas border border-orange-500/20 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          >
            {Array.from({ length: dimensions.height }).map((_, r) => (
              Array.from({ length: dimensions.width }).map((_, c) => {
                const key = `${r},${c}`;
                const placed = mapData[key];
                const tileDef = placed ? AVAILABLE_TILES.find(t => t.id === placed.tileId) : null;
                return (
                  <div
                    key={key}
                    onClick={() => handleTileClick(r, c)}
                    onContextMenu={(e) => handleRightClick(e, r, c)}
                    className="relative border border-orange-500/10 bg-zinc-900/40 hover:bg-orange-500/10 transition-colors overflow-hidden"
                    style={{ width: TILE_SIZE, height: TILE_SIZE }}
                  >
                    {tileDef && (
                      <img
                        src={tileDef.url}
                        className="w-full h-full object-cover relative z-10"
                        style={{ transform: `rotate(${placed.rotation}deg)` }}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/256/000/ea580c?text=SIGNAL_LOSS'; }}
                      />
                    )}
                    <div className="absolute top-1 left-1 text-[7px] text-zinc-700 font-mono pointer-events-none">
                      {r}:{c}
                    </div>
                  </div>
                );
              })
            ))}
          </div>
        </main>

        {showAnalysis && (
          <div className="absolute bottom-10 right-10 w-[400px] max-h-[70%] bg-black/95 backdrop-blur-xl border border-orange-500/50 rounded-lg shadow-[0_0_50px_rgba(234,88,12,0.2)] p-8 overflow-y-auto animate-in fade-in zoom-in-95 duration-500 z-50">
            <div className="flex justify-between items-start mb-6 border-b border-orange-500/30 pb-4">
              <div>
                <h3 className="text-xl font-black text-white font-mono tracking-widest uppercase">Analysis Report</h3>
                <p className="text-[10px] text-orange-500 font-mono uppercase">Structural integrity scan active</p>
              </div>
              <button onClick={() => setShowAnalysis(false)} className="text-zinc-600 hover:text-orange-500 transition-colors">
                <i className="fas fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-1 font-mono text-[11px]">
              <h4 className="text-orange-500 font-black mb-3 flex items-center gap-2 uppercase tracking-wider">
                <span className="w-1 h-3 bg-orange-600"></span>
                REGIONAL COMPOSITION
              </h4>
              <div className="grid gap-1">
                {tileStats.map(([name, qty]) => (
                  <div key={name} className="flex justify-between border-b border-zinc-900 pb-1.5 pt-0.5">
                    <span className="text-zinc-400">{name}</span>
                    <span className="text-white font-bold">{qty}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-900 flex justify-between text-[9px] text-zinc-600 font-mono">
                <span>STATION: ORBITAL_01</span>
                <span>DATA INTEGRITY VERIFIED</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;