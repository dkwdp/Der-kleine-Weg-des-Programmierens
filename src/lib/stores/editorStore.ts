import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Bestehende Stores
export const myVariable = writable("# Initial code");
export const pythonCode = writable("");
export const pythonOutput = writable("");
export const isCurrentLevelDrawing = writable(false);
export const solvedLevel = writable(false);
export const levelID = writable(0);
export const outputID = writable(0);

// Level-System Stores
export const unlockedLevels = writable([1]); 
export const gameMode = writable('progressive');

// localStorage nur im Browser verwenden
if (browser) {
    // Gespeicherte Werte laden
    try {
        const savedLevels = localStorage.getItem('unlockedLevels');
        const savedMode = localStorage.getItem('gameMode');
        
        if (savedLevels) {
            unlockedLevels.set(JSON.parse(savedLevels));
        }
        if (savedMode) {
            gameMode.set(JSON.parse(savedMode));
        }
    } catch (e) {
        console.error('Fehler beim Laden:', e);
    }
    
    // Automatisch speichern bei Änderungen
    unlockedLevels.subscribe(levels => {
        try {
            localStorage.setItem('unlockedLevels', JSON.stringify(levels));
            console.log('Levels gespeichert:', levels);
        } catch (e) {
            console.error('Fehler beim Speichern:', e);
        }
    });
    
    gameMode.subscribe(mode => {
        try {
            localStorage.setItem('gameMode', JSON.stringify(mode));
        } catch (e) {
            console.error('Fehler beim Speichern:', e);
        }
    });
}

// Hilfsfunktionen
export function unlockNextLevel(currentLevel: number) {
    unlockedLevels.update(levels => {
        const nextLevel = currentLevel + 1;
        if (nextLevel <= 10 && !levels.includes(nextLevel)) {
            const newLevels = [...levels, nextLevel];
            console.log(`Level ${nextLevel} freigeschaltet!`, newLevels);
            return newLevels;
        }
        return levels;
    });
}

export function unlockLevelsUpTo(targetLevel: number) {
    const levelsToUnlock = [];
    for (let i = 1; i <= targetLevel && i <= 10; i++) {
        levelsToUnlock.push(i);
    }
    unlockedLevels.set(levelsToUnlock);
}

// Fortschritt zurücksetzen (für Testing oder Reset-Button)
export function resetProgress() {
    unlockedLevels.set([1]);
    console.log('Fortschritt zurückgesetzt!');
}