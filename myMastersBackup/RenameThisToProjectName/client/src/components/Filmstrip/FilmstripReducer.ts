import * as actions from './ActionTypes';

const INITIAL_STATE = {
  dimensions: null,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.FILMSTRIP_RESIZE: {
      return {
        ...state,
        dimensions: action.dimensions,
      };
    }

    case actions.FILMSTRIP_UNMOUNT:
      return INITIAL_STATE;

    default:
      return state;
  }
}
