import { writable } from 'svelte/store';

export const myVariable = writable("# Initial code");
export const pythonCode = writable("");
export const pythonOutput =  writable("");
<<<<<<< HEAD
export const isCurrentLevelDrawing = writable(false);
=======
export const isCurrentLevelDrawing = writable(false);
export const solvedLevel = writable(false);
export const levelID = writable(0);
export const outputID = writable(0);
 
>>>>>>> newLevelOle
