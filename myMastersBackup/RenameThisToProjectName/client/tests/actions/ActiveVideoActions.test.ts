import { expect } from 'chai';
import {
  HIGHLIGHT_SELECT_COLOR,
} from '../../src/actions/ActionTypes';
import {
  onHighlightColorSelection,
} from '../../src/actions';

describe('Active Video Actions Test', () => {
  describe('onHighlightColorSelection', () => {
    it('has the correct type', () => {
      const action = onHighlightColorSelection('red');
      expect(action.type).to.equal(HIGHLIGHT_SELECT_COLOR);
    });

    it('has the correct payload', () => {
      const action = onHighlightColorSelection('red');
      expect(action.color).to.equal('red');
    });
  });
});
