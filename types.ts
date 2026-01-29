
export type CoefKey = 'a' | 'b' | 'c';

export interface Coef {
  key: CoefKey;
  label: string;
  color: string;
  value: number;
}

export interface Solution {
  disc: number;
  x1: number | string;
  x2: number | string;
  type: 'real' | 'complex' | 'single';
  steps: {
    discriminant: string;
    numerator1: string;
    numerator2: string;
    denominator: string;
  };
}

export type AnimationPhase = 'idle' | 'drop-a' | 'drop-b' | 'drop-c' | 'done';

export interface Point {
  x: number;
  y: number;
}

export interface MemorizationScene {
  id: "generic" | "numeric";
  title: string;
  coefs: Record<CoefKey, { label: string; color: string }>;
}
