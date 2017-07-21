export interface IComment {
  _id: string;
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
}
