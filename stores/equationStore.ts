import { create } from 'zustand';

interface Step {
  stepNumber: number;
  math: string;
  explanation: string;
}

interface EquationStore {
  equation: string;
  type: string;
  result: string;
  steps: Step[];
  setEquation: (equation: string) => void;
  setResult: (type: string, result: string, steps: Step[]) => void;
  clear: () => void;
}

export const useEquationStore = create<EquationStore>((set) => ({
  equation: '',
  type: '',
  result: '',
  steps: [],
  setEquation: (equation) => set({ equation }),
  setResult: (type, result, steps) => set({ type, result, steps }),
  clear: () => set({ equation: '', type: '', result: '', steps: [] }),
}));
