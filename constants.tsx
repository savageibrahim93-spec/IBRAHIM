
import React from 'react';
import { Resource, Upgrade } from './types';

export const INITIAL_RESOURCES: Resource[] = [
  { id: 'iron', name: 'Iron', amount: 0, valuePerUnit: 10, color: 'text-slate-400' },
  { id: 'silica', name: 'Silica', amount: 0, valuePerUnit: 25, color: 'text-blue-200' },
  { id: 'gold', name: 'Gold', amount: 0, valuePerUnit: 100, color: 'text-yellow-400' },
  { id: 'antimatter', name: 'Antimatter', amount: 0, valuePerUnit: 1500, color: 'text-purple-500' },
];

export const INITIAL_UPGRADES: Record<string, Upgrade> = {
  drill: {
    id: 'drill',
    name: 'Plasma Drill',
    description: 'Increases base mining speed.',
    cost: 500,
    level: 1,
    multiplier: 1.5
  },
  cargo: {
    id: 'cargo',
    name: 'Nano-Compressor',
    description: 'Extracts more value from each fragment.',
    cost: 1200,
    level: 1,
    multiplier: 1.2
  },
  scanner: {
    id: 'scanner',
    name: 'Gemini AI Uplink',
    description: 'Helps find higher rarity asteroids.',
    cost: 5000,
    level: 1,
    multiplier: 1.1
  }
};
