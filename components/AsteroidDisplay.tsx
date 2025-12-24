
import React, { useMemo } from 'react';
import { Asteroid } from '../types';

interface Props {
  asteroid: Asteroid | null;
  isMining: boolean;
  onScan: () => void;
  onManualMine: () => void;
  scanning: boolean;
}

const AsteroidDisplay: React.FC<Props> = ({ asteroid, isMining, onScan, onManualMine, scanning }) => {
  const rarityColors = {
    Common: 'border-slate-500 text-slate-500',
    Uncommon: 'border-green-500 text-green-500',
    Rare: 'border-blue-500 text-blue-500',
    Legendary: 'border-purple-500 text-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]',
  };

  // Generate some "rocky" visual artifacts
  const rocks = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    top: Math.random() * 80 + 10,
    left: Math.random() * 80 + 10,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.5 + 0.2
  })), []);

  return (
    <div className="relative glass h-full rounded-xl overflow-hidden flex flex-col items-center justify-center border border-white/10 group">
      <div className="scanline"></div>
      
      {asteroid ? (
        <div className="w-full h-full flex flex-col p-8">
          <div className="flex justify-between items-start mb-8 z-20">
            <div>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${rarityColors[asteroid.rarity]} uppercase font-bold tracking-tighter mb-2 inline-block`}>
                {asteroid.rarity} TARGET
              </span>
              <h1 className="text-3xl font-bold text-white">{asteroid.name}</h1>
              <p className="text-sm text-slate-400 mt-2 max-w-md italic">{asteroid.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase">Integrity</p>
              <p className="text-2xl font-bold text-white mono">
                {((asteroid.remainingResources / asteroid.totalResources) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center perspective-1000">
            {/* Visual Asteroid */}
            <div 
              onClick={onManualMine}
              className={`
                relative w-64 h-64 rounded-full cursor-pointer transition-all duration-300
                bg-gradient-to-br from-slate-700 via-slate-800 to-black
                border-2 border-slate-600/30 group-hover:scale-105 active:scale-95
                ${isMining ? 'animate-pulse shadow-[0_0_40px_rgba(0,150,255,0.2)]' : 'shadow-2xl'}
              `}
            >
              {rocks.map(rock => (
                <div 
                  key={rock.id}
                  className="absolute bg-slate-900 rounded-sm"
                  style={{
                    top: `${rock.top}%`,
                    left: `${rock.left}%`,
                    width: `${rock.size}px`,
                    height: `${rock.size}px`,
                    opacity: rock.opacity,
                    transform: 'rotate(45deg)'
                  }}
                />
              ))}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] rounded-full" />
              
              {isMining && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-1 bg-blue-500/50 absolute rotate-45 animate-[ping_1.5s_infinite]" />
                  <div className="w-full h-1 bg-blue-500/50 absolute -rotate-45 animate-[ping_1.5s_infinite]" />
                </div>
              )}
            </div>

            {/* Mining status effect */}
            {isMining && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-blue-600/20 px-4 py-2 rounded-full border border-blue-500/40">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Extraction in Progress</span>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-4 z-20">
            <button 
              onClick={onScan}
              disabled={scanning}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/20 font-bold uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {scanning ? 'Searching...' : 'Scan Belt'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <div className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Void Signal Detected</h2>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">Sensors indicate several mineral-rich asteroids in the vicinity. Initiate scan to target.</p>
          <button 
            onClick={onScan}
            disabled={scanning}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-lg shadow-green-900/40 font-bold uppercase tracking-widest transition-all"
          >
            {scanning ? 'Locking Signal...' : 'Initiate Scan'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AsteroidDisplay;
