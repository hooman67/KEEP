import { expect } from 'chai';
import * as actions from '../../src/actions/ActionTypes';
import {
  onFilmstripResize,
  onFilmstripUnMount,
  onHighlightFilmstripPlayHighlight,
} from '../../src/actions';

describe('Filmstrip Actions Test', () => {
  it('onFilmstripResize Test', () => {
    expect(onFilmstripResize({ height: 100, width: 100 })).to.eql({
      type: actions.FILMSTRIP_RESIZE,
      dimensions: {
        height: 100,
        width: 100,
      },
    });
  });

  it('onFilmstripUnMount Test', () => {
    expect(onFilmstripUnMount()).to.eql({
      type: actions.FILMSTRIP_UNMOUNT,
    });
  });

  it('onHighlightFilmstripPlayHighlight Test', () => {
    expect(onHighlightFilmstripPlayHighlight({ start: 0, end: 100 }, 0))
      .to
      .eql({
        type: actions.HIGHLIGHT_FILMSTRIP_PLAY_HIGHLIGHT,
        interval: {
          start: 0,
          end: 100,
        },
        index: 0,
      });
  });
});
