// XP required to advance from `level` to `level + 1`
export function xpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

// Total XP accumulated to reach `level` from level 1
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) total += xpToNextLevel(l);
  return total;
}

// Process XP gain and return new character state (may level up multiple times)
export function processXpGain(
  currentXp: number,
  currentLevel: number,
  xpGained: number
): {
  newXp: number;
  newLevel: number;
  leveledUp: boolean;
  levelsGained: number;
  hpMaxIncrease: number;
  mpMaxIncrease: number;
  statPointsGranted: number;
} {
  let xp = currentXp + xpGained;
  let level = currentLevel;
  let levelsGained = 0;

  while (xp >= xpToNextLevel(level)) {
    xp -= xpToNextLevel(level);
    level += 1;
    levelsGained += 1;
  }

  return {
    newXp: xp,
    newLevel: level,
    leveledUp: levelsGained > 0,
    levelsGained,
    hpMaxIncrease: levelsGained * 10,
    mpMaxIncrease: levelsGained * 5,
    statPointsGranted: levelsGained * 3,
  };
}

// HP/MP max based on level
export function hpMaxForLevel(level: number): number {
  return 100 + (level - 1) * 10;
}

export function mpMaxForLevel(level: number): number {
  return 50 + (level - 1) * 5;
}
