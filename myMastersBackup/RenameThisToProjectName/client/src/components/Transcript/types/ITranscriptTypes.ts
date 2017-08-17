export interface IIndex {
  onVideoPlayerSeek: Function;
  startTime: number;
  formattedTime: number;
}
export interface IWord {
  end: number;
  start: number;
  colors: Array<string>;
  isSearch: boolean;
  text: string;
}
export interface IWordProps {
  selectSection: any;
  action: any;
  word: IWord;
  currentTime: number;
  highlightingMode: any;
  commentingMode: any;
  comments: Array<any>;
  displayButton: any;
  displayButtonFalse: any;
  showInterval: any;
}
export interface ICommentProps {
  comments: Array<any>;
  action: any;
}
export interface ILine {
  transcriptArr: Array<any>;
  sentenceArr: Array<IWord>;
  activeVideo: any;
  transcript: any;
  word: IWord;
  action: any;
}
export interface IDimensions {
  height: number;
  width: number;
}

export interface ITranscriptProps {
  onHighlightSelectSectionStart: Function;
  onHighlightSelectSectionInProcess: Function;
  onHighlightSelectSectionEnd: Function;
  onHighlightSelectSectionClear: Function;
  onCommentSelectSectionStart: Function;
  onCommentSelectSectionInProcess: Function;
  onCommentSelectSectionEnd: Function;
  onCommentSendText: Function;
  onCommentEditText: Function;
  onCommentDeleteText: Function;
  onCommentCancelText: Function;
  onCommentReply: Function;
  onCommentSelectSectionClear: Function;
  onVideoPlayerSeek: Function;
  onCommonTranscriptSeek: Function;
  activeVideo: any;
  transcriptUpdate: any;
}
