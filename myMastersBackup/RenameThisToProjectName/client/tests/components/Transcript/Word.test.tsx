import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount, render, shallow } from 'enzyme';
import Word from '../../../src/components/Transcript/Word';

const minProps = {
  selectSection: {
    startTime: 0,
    endTime: 1,
    status: 'free',
  },
  action: {
    onHighlightSelectSectionStart: () => {},
    onHighlightSelectSectionEnd: () => {},
    onHighlightSelectSectionInProcess: () => {},
    onHighlightSelectSectionClear: () => {},
  },
  word: {
    end: 2,
    start: 0,
    colors: [],
    isSearch: true,
    text: 'testWord',
  },
};

describe('Transcript: text Render', () => {
  it('Check text render', () => {
    const wrapper = shallow(<Word {...minProps} />);
    expect(wrapper).to.have.length(1);
  });
  it('Check Word component render', () => {
    const wrapper = shallow(<Word {...minProps} />);
    expect(wrapper.find('span').text()).to.eq('testWord ');
  });
  it('Check Mouse Down', () => {
    const onMousedownHandler = sinon.spy(Word.prototype, 'onMousedownHandler');
    // const wrapper = shallow(<Word {...minProps} onMouseDown={onMousedownHandler} />);
    const wrapper = shallow(<Word {...minProps} />);
    expect(onMousedownHandler.calledOnce).to.equal(false);
    wrapper.simulate('mouseDown');
    expect(onMousedownHandler.calledOnce).to.equal(true);
  });
  it('Check Mouse Move', () => {
    const onMouseMoveHandler = sinon.spy(Word.prototype, 'onMouseMoveHandler');
    // const wrapper = shallow(<Word {...minProps} onMouseMove={onMouseMoveHandler} />);
    const wrapper = shallow(<Word {...minProps} />);
    // wrapper.setProps(
    //   {
    //     ...minProps,
    //     action: {
    //       onHighlightSelectSectionInProcess: () => {},
    //     },
    //     selectSection: {
    //       status: 'start',
    //     },
    //   },
    // );
    expect(onMouseMoveHandler.calledOnce).to.equal(false);
    wrapper.simulate('mouseMove');
    expect(onMouseMoveHandler.calledOnce).to.equal(true);
  });

  it('Check Mouse Up', () => {
    const onMouseupHandler = sinon.spy(Word.prototype, 'onMouseupHandler');
    // const wrapper = shallow(<Word {...minProps} onMouseUp={onMouseupHandler} />);
    const wrapper = shallow(<Word {...minProps} />);
    // wrapper.setProps(
    //   {
    //     ...minProps,
    //     action: {
    //       onHighlightSelectSectionEnd: () => {},
    //       onHighlightSelectSectionClear: () => {},
    //     },
    //     selectSection: {
    //       status: 'end',
    //     },
    //   },
    // );
    expect(onMouseupHandler.calledOnce).to.equal(false);
    wrapper.simulate('mouseUp');
    expect(onMouseupHandler.calledOnce).to.equal(true);
  });
});
