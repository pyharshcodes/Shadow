'use client';

import React, { useState } from 'react';
import { Dumbbell, Flame, Zap, Shield, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Goal {
  id: string;
  name: string;
  sub: string;
  icon: any;
  categoryMatch: string;
}

const GOALS: Goal[] = [
  {
    id: 'build-muscle',
    name: 'BUILD MUSCLE',
    sub: 'Hypertrophy & High-Volume Tension',
    icon: Dumbbell,
    categoryMatch: 'Muscle Building',
  },
  {
    id: 'get-stronger',
    name: 'GET STRONGER',
    sub: 'Compound Lifts & Peak Power',
    icon: Shield,
    categoryMatch: 'Strength',
  },
  {
    id: 'athletic-agility',
    name: 'ATHLETIC POWER',
    sub: 'Speed, Mobility & Work Capacity',
    icon: Zap,
    categoryMatch: 'Functional',
  },
  {
    id: 'one-on-one',
    name: '1-ON-1 GUIDANCE',
    sub: 'Biomechanical Audit & Custom Program',
    icon: Target,
    categoryMatch: 'Personal Training',
  },
];

export function GoalSelector({ onSelectGoal }: { onSelectGoal?: (category: string) => void }) {
  const [selectedGoal, setSelectedGoal] = useState<string>('build-muscle');

  const handleSelect = (goal: Goal) => {
    setSelectedGoal(goal.id);
    if (onSelectGoal) {
      onSelectGoal(goal.categoryMatch);
    }
    // Smooth scroll down to programs section
    const el = document.getElementById('programs');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {GOALS.map((goal) => {
        const Icon = goal.icon;
        const isSelected = selectedGoal === goal.id;
        return (
          <button
            key={goal.id}
            onClick={() => handleSelect(goal)}
            className={`p-6 rounded-xl border text-left transition-all duration-300 relative group flex flex-col justify-between h-44 ${
              isSelected
                ? 'bg-zinc-900 border-accent shadow-[0_0_20px_rgba(212,249,51,0.12)]'
                : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-600 hover:bg-zinc-900/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-accent/10 border-accent/40 text-accent'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight
                  className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                    isSelected ? 'text-accent' : 'text-zinc-600'
                  }`}
                />
              </div>
              <h4 className="text-xl font-display font-black tracking-wider uppercase text-white group-hover:text-accent transition-colors">
                {goal.name}
              </h4>
            </div>
            <p className="text-xs text-zinc-400 font-sans tracking-wide">
              {goal.sub}
            </p>
          </button>
        );
      })}
    </div>
  );
}
