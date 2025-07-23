import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import levels from '../../data/levels.json';


// Stores
export const myVariable = writable("# Initial code");
export const isCurrentLevelDrawing = writable(false);
export const solvedLevel = writable(false);
export const levelID = writable(0);
export const outputID = writable(0);
export const showOutput = writable(false)
export const max_levels = levels.length;
export const level_range = Array.from({length: max_levels}, (_, i) => i + 1);

// Level-System Stores
export const unlockedLevels = writable([1]); 
export const gameMode = writable('progressive');

export const bonusLevelsUnlocked = writable([]);

// Bonus-Level Freischaltungs-Bedingungen
const bonusUnlockRequirements = {
    // wenn Level 7 fertig ist, zeigt sich Bonus Level 1 zwischen Level 7 und 8
    1: 8,
    // Beispiel für zweites Boni Level, dass sich nach dem 6. Level freischaltet 
    // (Wichtig: Im map svelte Bonus Level hinzufügen)
    // 2: 7, 
};

// localStorage nur im Browser verwenden
if (browser) {
    // Gespeicherte Werte aus dem localStorage (Browserspeicher) laden
    try {
        const savedLevels = localStorage.getItem('unlockedLevels');
        const savedMode = localStorage.getItem('gameMode');
        const savedBonusLevels = localStorage.getItem('bonusLevelsUnlocked');
        
        if (savedLevels) {
            unlockedLevels.set(JSON.parse(savedLevels));
        }
        if (savedMode) {
            gameMode.set(JSON.parse(savedMode));
        }
        if (savedBonusLevels) {
            bonusLevelsUnlocked.set(JSON.parse(savedBonusLevels));
        }
    } catch (e) {
        console.error('Fehler beim Laden:', e);
    }
    
    // Automatisch speichern bei Änderungen im Store für Level
    unlockedLevels.subscribe(levels => {
        try {
            localStorage.setItem('unlockedLevels', JSON.stringify(levels));
            console.log('Levels gespeichert:', levels);
        } catch (e) {
            console.error('Fehler beim Speichern:', e);
        }
    });
    
     // Automatisch speichern bei Änderungen im Store für Game Mode
    gameMode.subscribe(mode => {
        try {
            localStorage.setItem('gameMode', JSON.stringify(mode));
        } catch (e) {
            console.error('Fehler beim Speichern:', e);
        }
    });
    
    // Automatisch speichern bei Änderungen im Store vom Bonus Level
    bonusLevelsUnlocked.subscribe(bonusLevels => {
        try {
            localStorage.setItem('bonusLevelsUnlocked', JSON.stringify(bonusLevels));
            console.log('Bonus-Level gespeichert:', bonusLevels);
        } catch (e) {
            console.error('Fehler beim Speichern der Bonus-Level:', e);
        }
    });
}

// Bestehende Hilfsfunktionen
export function unlockNextLevel(currentLevel: number) {
    unlockedLevels.update(levels => {
        const nextLevel = currentLevel + 1;
        if (nextLevel <= max_levels && !levels.includes(nextLevel)) {
            const newLevels = [...levels, nextLevel];
            console.log(`Level ${nextLevel} freigeschaltet!`, newLevels);
            
            checkAndUnlockBonusLevels(currentLevel);
            
            return newLevels;
        }
        return levels;
    });
}

export function unlockLevelsUpTo(targetLevel: number) {
    const levelsToUnlock = [];
    for (let i = 1; i <= targetLevel && i <= max_levels; i++) {
        levelsToUnlock.push(i);
    }
    unlockedLevels.set(levelsToUnlock);
    

    bonusLevelsUnlocked.set([]);
    checkAndUnlockBonusLevels(targetLevel);
}

// Prüft und schaltet Bonus-Level frei basierend auf abgeschlossenem Level
export function checkAndUnlockBonusLevels(completedLevel: number) {
    bonusLevelsUnlocked.update(currentBonusLevels => {
        let newBonusLevels = [...currentBonusLevels];
        let unlocked = false;
        
        // Prüfe alle Bonus-Level Bedingungen
        for (const [bonusId, requiredLevel] of Object.entries(bonusUnlockRequirements)) {
            const bonusIdNum = parseInt(bonusId);
            
            // Wenn Level-Anforderung erfüllt und noch nicht freigeschaltet
            if (completedLevel >= requiredLevel && !newBonusLevels.includes(bonusIdNum)) {
                newBonusLevels.push(bonusIdNum);
                unlocked = true;
                console.log(`Bonus-Level ${bonusIdNum} freigeschaltet! (Nach Level ${completedLevel})`);
            }
        }
        
        return unlocked ? newBonusLevels.sort() : currentBonusLevels;
    });
}