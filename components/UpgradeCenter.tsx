
import React from 'react';
import { Upgrade } from '../types';

interface Props {
  upgrades: Record<string, Upgrade>;
  credits: number;
  onUpgrade: (id: string) => void;
}

const UpgradeCenter: React.FC<Props> = ({ upgrades, credits, onUpgrade }) => {
  return (
    <div className="glass p-6 rounded-xl border border-blue-500/20">
      <h2 className="text-xl font-bold text-blue-400 mb-6 tracking-wider flex items-center gap-2">
        ENGINEERING BAY
      </h2>
      <div className="space-y-4">
        {Object.values(upgrades).map((upg) => {
          const canAfford = credits >= upg.cost;
          return (
            <div key={upg.id} className="group p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors">{upg.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{upg.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-blue-500 font-bold uppercase">LVL {upg.level}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className={`text-sm mono font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                  Cost: ${upg.cost.toLocaleString()}
                </span>
                <button
                  disabled={!canAfford}
                  onClick={() => onUpgrade(upg.id)}
                  className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-all ${
                    canAfford 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40' 
                      : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  Install
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpgradeCenter;
