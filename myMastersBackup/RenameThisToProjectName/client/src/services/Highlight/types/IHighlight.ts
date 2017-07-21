export interface IHighlight {
  _id: string;
  Color: string;
  TimeRange: {
    start: Number;
    end: Number;
  };
}

export interface IHighlightSelectSection {
  selectSectionStartTime: number;
  selectSectionEndTime: number;
  status: string;
}
