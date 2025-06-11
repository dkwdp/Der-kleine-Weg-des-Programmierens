import { writable } from 'svelte/store';

export const myVariable = writable("# Initial code");
export const pythonCode = writable("");
export const pythonOutput =  writable("");
export const isCurrentLevelDrawing = writable(false);