import { ICommentSelectSection, IColorPickerData } from '../../services/Comment/types';

import { ICursorPosition } from '../../types';

import {IFilmstripDimensionsData} from '../Filmstrip/types';

export interface IColorPicker {
  selectSection: ICommentSelectSection;
  cursorPosition: ICursorPosition;
  onCommentSendText: Function;
  onCommentSendFilmStripText: Function;
  colorPickerData: IColorPickerData;
  colorPickerDisplay: boolean;
  activeCommentColor: any;
  filmstripDimensions: IFilmstripDimensionsData;
  editCommentFilmStripFinish: Function;
  cancelCommentEditFilmstrip: Function;
}
