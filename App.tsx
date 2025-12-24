
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Asteroid, Resource } from './types';
import { INITIAL_RESOURCES, INITIAL_UPGRADES } from './constants';
import ResourceMonitor from './components/ResourceMonitor';
import UpgradeCenter from './components/UpgradeCenter';
import AsteroidDisplay from './components/AsteroidDisplay';
import { scanNewAsteroid, getMarketAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    credits: 1000,
    resources: INITIAL_RESOURCES,
    activeAsteroid: null,
    upgrades: INITIAL_UPGRADES,
    miningRate: 0.1,
    isMining: false
  });

  const [scanning, setScanning] = useState(false);
  const [advice, setAdvice] = useState("Awaiting command, Admiral.");
  const lastTickRef = useRef<number>(Date.now());

  // Game Loop
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setState(prev => {
        if (!prev.isMining || !prev.activeAsteroid) return prev;

        const amountToMine = prev.miningRate * delta;
        const newRemaining = Math.max(0, prev.activeAsteroid.remainingResources - amountToMine);
        
        // Distribute resources based on asteroid rarity
        const resourceWeights = {
          Common: ['iron', 'iron', 'silica'],
          Uncommon: ['iron', 'silica', 'silica', 'gold'],
          Rare: ['silica', 'gold', 'gold', 'antimatter'],
          Legendary: ['gold', 'antimatter', 'antimatter']
        };
        
        const weights = resourceWeights[prev.activeAsteroid.rarity];
        const resourceId = weights[Math.floor(Math.random() * weights.length)];

        const newResources = prev.resources.map(res => {
          if (res.id === resourceId) {
            return { ...res, amount: res.amount + amountToMine };
          }
          return res;
        });

        // Auto-sell when certain thresholds met or just keep simple for simulation
        // Let's manually sell for now via button or auto-convert
        let newCredits = prev.credits;
        const processedResources = newResources.map(res => {
          if (res.amount > 10) { // Auto-sell surplus
            const toSell = res.amount - 10;
            newCredits += toSell * res.valuePerUnit * prev.upgrades.cargo.multiplier;
            return { ...res, amount: 10 };
          }
          return res;
        });

        return {
          ...prev,
          credits: newCredits,
          resources: processedResources,
          activeAsteroid: { ...prev.activeAsteroid, remainingResources: newRemaining },
          isMining: newRemaining > 0
        };
      });
    };

    const intervalId = setInterval(tick, 100);
    return () => clearInterval(intervalId);
  }, []);

  const handleScan = async () => {
    setScanning(true);
    const newAstro = await scanNewAsteroid(state.upgrades.scanner.level);
    setState(prev => ({ ...prev, activeAsteroid: newAstro, isMining: true }));
    setScanning(false);
    
    // Get advice from Gemini
    const newAdvice = await getMarketAdvice(state.credits, state.resources);
    setAdvice(newAdvice);
  };

  const handleUpgrade = (id: string) => {
    setState(prev => {
      const upg = prev.upgrades[id];
      if (prev.credits < upg.cost) return prev;

      const newUpg = {
        ...upg,
        level: upg.level + 1,
        cost: Math.floor(upg.cost * 1.8)
      };

      let newMiningRate = prev.miningRate;
      if (id === 'drill') newMiningRate *= upg.multiplier;

      return {
        ...prev,
        credits: prev.credits - upg.cost,
        upgrades: { ...prev.upgrades, [id]: newUpg },
        miningRate: newMiningRate
      };
    });
  };

  const handleManualMine = () => {
    if (!state.activeAsteroid) return;
    setState(prev => {
      const clickPower = prev.miningRate * 2;
      return {
        ...prev,
        credits: prev.credits + 10 // Bonus credits for manual work
      };
    });
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-black font-black text-2xl rotate-3 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            SF
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-white uppercase italic">Stellar Forge</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Asteroid Prospecting Suite v4.2</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl bg-white/5 border border-white/10 p-3 rounded-lg flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
            <span className="text-blue-400 font-bold text-xs animate-pulse">AI</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">NOVA Terminal Advice</p>
            <p className="text-sm text-slate-300 italic truncate lg:whitespace-normal">"{advice}"</p>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Resources */}
        <div className="lg:col-span-3 h-full">
          <ResourceMonitor 
            credits={state.credits} 
            resources={state.resources} 
            miningRate={state.miningRate} 
          />
        </div>

        {/* Center Column: Mining Display */}
        <div className="lg:col-span-6 h-[500px] lg:h-auto">
          <AsteroidDisplay 
            asteroid={state.activeAsteroid} 
            isMining={state.isMining} 
            onScan={handleScan}
            onManualMine={handleManualMine}
            scanning={scanning}
          />
        </div>

        {/* Right Column: Upgrades */}
        <div className="lg:col-span-3 h-full">
          <UpgradeCenter 
            upgrades={state.upgrades} 
            credits={state.credits} 
            onUpgrade={handleUpgrade}
          />
        </div>
      </main>

      {/* Footer Log */}
      <footer className="glass p-3 rounded border border-white/5 mono text-[10px] text-slate-500 flex justify-between items-center">
        <div className="flex gap-4">
          <span>&gt; UPLINK: STABLE</span>
          <span>&gt; LOCAL TIME: {new Date().toLocaleTimeString()}</span>
          <span>&gt; SYSTEM: EPSILON ERIDANI</span>
        </div>
        <div className="text-green-500/50">
          SECURE_CON_ESTABLISHED_0x8922
        </div>
      </footer>
    </div>
  );
};

export default App;
