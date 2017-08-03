export interface IComment {
  _id: string;
  TimeStamp: string;
  Color: string;
  TimeRange: {
    start: Number;
    end: Number;
  };
  Text: string;
  Parent: string;
  //Replies: Array<string>;
  //Below works if you change the CommentHelper.ts aswell
  Replies: Array<IComment>;
  commentExpandAll: boolean;
}

/**
 * For adding comment box on filmstrip
 */
export interface ICommentSelectSection{
  selectSectionStartTime: number;
  selectSectionEndTime: number;
  status: string;
}

export interface IColorPickerData{
  TimeStamp: string;
  Color: string,
  Text: string,
  Parent: string;
  TimeRange: {
    start: Number;
    end: Number;
  }
  _id: string;
  Replies: Array<IComment>;
  commentExpandAll: boolean;
}