export interface ICursorPosition {
  x: number;
  y: number;
  isOutside: boolean;
}

export interface IDimensions {
  height: number;
  width: number;
}

export type TimeRange = {
  startTime: number;
  endTime: number;
};

export type TranscriptWord = TimeRange;

export type TranscriptLine = TimeRange | {
  id: number;
  formattedTime: string;
  sentenceArr: Array<TranscriptWord>;
};

export interface IHighlightData {
  red: (Array<{ start: number, end: number}> | undefined);
  purple: (Array<{ start: number, end: number}> | undefined);
  green: (Array<{ start: number, end: number}> | undefined);
  yellow: (Array<{ start: number, end: number}> | undefined);
  blue: (Array<{ start: number, end: number}> | undefined);
}

export interface IHighlightSelectSection {
  selectSectionStartTime: number | null;
  selectSectionEndTime: number | null;
  status: ('free' | 'end' | 'start');
}

export interface ICommentData {
  red: (Array<{ start: number, end: number}> | undefined);
  green: (Array<{ start: number, end: number}> | undefined);
  yellow: (Array<{ start: number, end: number}> | undefined);
  blue: (Array<{ start: number, end: number}> | undefined);
}

export interface ICommentSelectSection {
  selectSectionStartTime: number | null;
  selectSectionEndTime: number | null;
  status: ('free' | 'end' | 'start');
}

export type TCurrentTime = number;
