
import React from 'react';
import { Resource } from '../types';

interface Props {
  credits: number;
  resources: Resource[];
  miningRate: number;
}

const ResourceMonitor: React.FC<Props> = ({ credits, resources, miningRate }) => {
  return (
    <div className="glass p-6 rounded-xl border border-green-500/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-green-400 tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          CENTRAL HUB MONITOR
        </h2>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase font-bold">Available Credits</p>
          <p className="text-2xl font-bold text-white mono">${credits.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Efficiency</p>
          <p className="text-lg font-bold text-blue-400">{(miningRate * 60).toFixed(1)}/min</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Threads</p>
          <p className="text-lg font-bold text-purple-400">Stable</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/10 pb-2">Inventory Assets</p>
        {resources.map((res) => (
          <div key={res.id} className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm">
              <span className={`font-medium ${res.color}`}>{res.name}</span>
              <span className="text-white mono">{res.amount.toFixed(2)} units</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-current ${res.color.replace('text-', 'bg-')}`} 
                style={{ width: `${Math.min(res.amount / 100, 1) * 100}%`, transition: 'width 0.3s' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceMonitor;
