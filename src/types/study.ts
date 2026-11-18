export type ChapterId = 'all' | 'line' | 'transmission' | 'fault' | 'distribution';

export type SchematicType =
  | 'equilateral-line'
  | 'sag-catenary'
  | 'ferranti-phasor'
  | 'pi-network'
  | 'percent-impedance'
  | 'petersen-coil'
  | 'power-factor-triangle'
  | 'arrester-insulation';

export interface Question {
  id: string;
  numberLabel: string; // e.g., "Q.01"
  examSession: string; // e.g., "2024년 1회 기출"
  chapter: Exclude<ChapterId, 'all'>;
  chapterName: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number; // 0..3
  formulaHint: string;
  schematic?: SchematicType;
  schematicCaption?: string;
  explanationSteps: string[];
  keyTakeaway: string;
}

export interface ChapterMeta {
  id: ChapterId;
  label: string;
  shortLabel: string;
  description: string;
}

export interface FormulaCardItem {
  id: string;
  chapter: Exclude<ChapterId, 'all'>;
  title: string;
  formula: string;
  unit: string;
  note: string;
}

export type MistakeStatus = 'incorrect' | 'hold' | 'mastered';

export interface AttemptRecord {
  questionId: string;
  selectedIndex: number | null; // null if skipped via "모름"
  isCorrect: boolean;
  isSkipped: boolean;
  mistakeStatus?: MistakeStatus;
  bookmarked: boolean;
  updatedAt: number;
}

export type ActiveTab = 'solve' | 'mistakes';
export type MistakeFilter = 'all' | 'incorrect' | 'hold' | 'bookmarked';
