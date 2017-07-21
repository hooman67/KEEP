import 'whatwg-fetch';
import {
  ActionCreator,
  IAction,
} from '../../services/ActionCreator';
import * as actions from './ActionTypes';

/**
 * Handle filmstrip react-measure element resize event
 * dimensions contain height and width information
 *
 * @param dimensions
 */
export const onFilmstripResize = ActionCreator<IAction>(actions.FILMSTRIP_RESIZE, 'dimensions');

/**
 * Filmstrip unmounted action
 */
export const onFilmstripUnMount = ActionCreator<IAction>(actions.FILMSTRIP_UNMOUNT);
