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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        [key]: {
          ...existing,
          rotation: (existing.rotation + 90) % 360
        }
      }));
    } else if (selectedTileId) {
      setMapData(prev => ({
        ...prev,
        [key]: {
          tileId: selectedTileId,
          rotation: 0
        }
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
    if (window.confirm("CRITICAL: CONFIRM DATA PURGE? DATA WILL BE LOST PERMANENTLY.")) {
      setMapData({});
      setShowAnalysis(false);
    }
  };

  const exportMap = async () => {
    if (Object.keys(mapData).length === 0) {
      alert("ERROR: INPUT BUFFER EMPTY. NO DATA TO EXPORT.");
      return;
    }

    const canvas = document.createElement('canvas');
    const legendWidth = 500;
    const mapWidth = dimensions.width * TILE_SIZE;
    const mapHeight = dimensions.height * TILE_SIZE;
    
    canvas.width = mapWidth + legendWidth;
    canvas.height = Math.max(mapHeight, 1200); 
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const loadImg = (url: string): Promise<HTMLImageElement> => new Promise((res) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => res(img);
      img.onerror = () => {
        const fallback = document.createElement('canvas');
        fallback.width = 256;
        fallback.height = 256;
        const fctx = fallback.getContext('2d');
        if (fctx) {
          fctx.fillStyle = '#111';
          fctx.fillRect(0, 0, 256, 256);
          fctx.strokeStyle = '#ea580c';
          fctx.lineWidth = 2;
          fctx.strokeRect(10, 10, 236, 236);
          fctx.fillStyle = '#ea580c';
          fctx.font = 'bold 20px monospace';
          fctx.textAlign = 'center';
          fctx.fillText('SIGNAL LOSS', 128, 120);
          fctx.font = '12px monospace';
          fctx.fillText(url, 128, 150);
        }
        const fallbackImg = new Image();
        fallbackImg.src = fallback.toDataURL();
        res(fallbackImg);
      };
      img.src = url;
    });

    const uniqueTileIds = Array.from(new Set((Object.values(mapData) as PlacedTile[]).map(p => p.tileId)));
    const imgCache: Record<string, HTMLImageElement> = {};
    
    try {
      for (const id of uniqueTileIds) {
        const def = AVAILABLE_TILES.find(t => t.id === id);
        if (def) imgCache[id] = await loadImg(def.url);
      }

      for (let r = 0; r < dimensions.height; r++) {
        for (let c = 0; c < dimensions.width; c++) {
          const key = `${r},${c}`;
          const placed = mapData[key];
          if (placed) {
            const img = imgCache[placed.tileId];
            const x = c * TILE_SIZE;
            const y = r * TILE_SIZE;
            
            ctx.save();
            ctx.translate(x + TILE_SIZE / 2, y + TILE_SIZE / 2);
            ctx.rotate((placed.rotation * Math.PI) / 180);
            ctx.drawImage(img, -TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
            ctx.restore();
          }
          ctx.strokeStyle = 'rgba(234, 88, 12, 0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }

      ctx.fillStyle = '#000000';
      ctx.fillRect(mapWidth, 0, legendWidth, canvas.height);
      
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 4;
      ctx.strokeRect(mapWidth + 20, 20, legendWidth - 40, canvas.height - 40);

      ctx.fillStyle = '#ea580c';
      ctx.font = 'bold 40px monospace';
      ctx.fillText('GRIMFIELDS', mapWidth + 50, 90);
      ctx.font = 'bold 18px monospace';
      ctx.fillText('TACTICAL_BATTLEFIELD_DOSSIER', mapWidth + 50, 125);
      
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.4)';
      ctx.beginPath();
      ctx.moveTo(mapWidth + 50, 150);
      ctx.lineTo(mapWidth + legendWidth - 50, 150);
      ctx.stroke();

      let currentY = 190;

      ctx.fillStyle = '#ea580c';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('>>> REGIONAL_COMPOSITION', mapWidth + 50, currentY);
      currentY += 40;
      
      ctx.font = '14px monospace';
      tileStats.forEach(([name, count]) => {
         ctx.fillStyle = '#ea580c';
         ctx.fillRect(mapWidth + 50, currentY - 12, 6, 14);
         
         ctx.fillStyle = '#ffffff';
         ctx.fillText(name.toUpperCase(), mapWidth + 70, currentY);
         
         ctx.fillStyle = '#ea580c';
         ctx.textAlign = 'right';
         ctx.fillText(`COUNT: ${count}`, mapWidth + legendWidth - 65, currentY);
         ctx.textAlign = 'left';
         
         currentY += 35;
      });

      const footerY = canvas.height - 100;
      ctx.fillStyle = '#ea580c';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('SURVEY_METADATA', mapWidth + 50, footerY - 110);
      
      ctx.fillStyle = '#71717a';
      ctx.font = '13px monospace';
      ctx.fillText(`GEO_RESOLUTION: ${mapWidth} x ${mapHeight}`, mapWidth + 50, footerY - 80);
      ctx.fillText(`GRID_ALLOCATION: ${dimensions.width} x ${dimensions.height} UNITS`, mapWidth + 50, footerY - 55);
      ctx.fillText(`EXTRACT_TIME: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}`, mapWidth + 50, footerY - 30);
      ctx.fillStyle = '#ea580c';
      ctx.fillText('ENCRYPTED_LINK_ACTIVE // STATION_ORBIT_01', mapWidth + 50, footerY + 10);

      const link = document.createElement('a');
      link.download = `grimfields_dossier_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (e) {
      console.error(e);
      alert("CRITICAL_ERROR: Dossier generation failed. See console for logs.");
    }
  };

  const handleImportTrigger = () => {
    fileInputRef.current?.click();
  };

  const importMap = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.dimensions && json.mapData) {
          setDimensions(json.dimensions);
          setMapData(json.mapData);
        } else {
          throw new Error("Invalid format");
        }
      } catch (err) {
        alert("ERROR: CORRUPT MANIFEST DATA. PARSING FAILED.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
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

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${dimensions.width}, ${TILE_SIZE}px)`,
    gridTemplateRows: `repeat(${dimensions.height}, ${TILE_SIZE}px)`,
    width: dimensions.width * TILE_SIZE,
    height: dimensions.height * TILE_SIZE,
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    transition: 'transform 0.1s ease-out',
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans text-white">
      <input 
        ref={fileInputRef} 
        type="file" 
        accept=".json" 
        className="hidden" 
        onChange={importMap} 
      />
      
      <ControlPanel 
        dimensions={dimensions} 
        setDimensions={setDimensions} 
        onClear={clearMap}
        onExport={exportMap}
        onImport={handleImportTrigger}
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
          className="flex-1 overflow-auto bg-[#050505] p-24 flex justify-start items-start relative select-none"
        >
          <div 
            style={gridStyle} 
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
                    className="relative border border-orange-500/20 bg-zinc-800/60 hover:bg-orange-500/20 transition-colors cursor-crosshair group overflow-hidden"
                    style={{ width: TILE_SIZE, height: TILE_SIZE }}
                  >
                    {tileDef && (
                      <img
                        src={tileDef.url}
                        alt={tileDef.name}
                        className="w-full h-full object-cover relative z-10"
                        style={{ transform: `rotate(${placed.rotation}deg)` }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/256/000/ea580c?text=SIGNAL_LOSS';
                        }}
                      />
                    )}
                    
                    {!placed && selectedTileId && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none transition-opacity z-20">
                         <img
                          src={AVAILABLE_TILES.find(t => t.id === selectedTileId)?.url}
                          className="w-full h-full object-cover grayscale brightness-50"
                        />
                      </div>
                    )}

                    <div className="absolute top-2 left-2 text-[8px] text-orange-500/60 font-mono opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none">
                      COORD_{r}:{c}
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

        <div className="absolute bottom-8 left-88 p-4 bg-black/80 backdrop-blur rounded border border-zinc-800 text-[10px] text-zinc-500 pointer-events-none shadow-2xl font-mono uppercase tracking-widest">
          <div className="flex gap-8 items-center">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-600"></span> <strong className="text-white">L-CLICK</strong> PLOT/ROT</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-zinc-600"></span> <strong className="text-white">R-CLICK</strong> SCRUB</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-600"></span> <strong className="text-white">CTRL+WHEEL</strong> ZOOM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;