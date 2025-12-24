
export interface Resource {
  id: string;
  name: string;
  amount: number;
  valuePerUnit: number;
  color: string;
}

export interface Asteroid {
  id: string;
  name: string;
  composition: string;
  density: number;
  totalResources: number;
  remainingResources: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  description: string;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  multiplier: number;
}

export interface GameState {
  credits: number;
  resources: Resource[];
  activeAsteroid: Asteroid | null;
  upgrades: Record<string, Upgrade>;
  miningRate: number;
  isMining: boolean;
}
