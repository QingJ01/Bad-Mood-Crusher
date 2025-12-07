export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SHOW_RESULT = 'SHOW_RESULT'
}

export enum ToolType {
  ROCKET = 'ROCKET',
  SHREDDER = 'SHREDDER',
  BUBBLE = 'BUBBLE',
  BLACK_HOLE = 'BLACK_HOLE'
}

export interface MoodData {
  text: string;
}

export interface ComfortResponse {
  message: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  moodText: string;
  toolType: ToolType;
  comfortMessage: string;
}