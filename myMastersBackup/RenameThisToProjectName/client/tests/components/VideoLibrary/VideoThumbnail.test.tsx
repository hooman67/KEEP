import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount, render, shallow } from 'enzyme';
import Thumbnail from '../../../src/components/VideoThumbnail';

const minProps = {
  videoInfo: {
    author: 'APSC160',
    title: 'Arrays_I_VGA_10fps_keyint10_64kbps.mp4',
    description: 'Sample Description',
    thumbnails: [
      'https://research.hct.ece.ubc.ca/myview/thumbnails/58cb6d06e5719b13ee9a1cba/300/1.jpeg',
      'https://research.hct.ece.ubc.ca/myview/thumbnails/58cb6d06e5719b13ee9a1cba/300/164.jpeg',
      'https://research.hct.ece.ubc.ca/myview/thumbnails/58cb6d06e5719b13ee9a1cba/300/327.jpeg',
    ],
  },
};

describe('Video Thumbnail Component Test', () => {
  it('Check Video Thumbnail component render', () => {
    const wrapper = shallow(<Thumbnail {...minProps} />);
    wrapper.setState({ activeImgSrcId: 0 });
    expect(wrapper).to.have.length(1);
  });
  it('Check text render for title', () => {
    const wrapper = shallow(<Thumbnail {...minProps} />);
    expect(wrapper.find('p').at(0).text()).to.equal('Title: Arrays_I_VGA_10fps_keyint10_64kbps.mp4');
  });
  it('Check text render for author', () => {
    const wrapper = shallow(<Thumbnail {...minProps} />);
    expect(wrapper.find('p').at(1).text()).to.equal('Author: APSC160');
  });
  it('Check text render for description', () => {
    const wrapper = shallow(<Thumbnail {...minProps} />);
    expect(wrapper.find('p').at(2).text()).to.equal('Description: Sample Description');
  });
  it('Check Video Thumbnail componentWillReceiveProps call', () => {
    const spy = sinon.spy(Thumbnail.prototype, 'componentWillReceiveProps');
    const wrapper = shallow(<Thumbnail {...minProps} />);
    wrapper.setState({ activeImgSrcId: 0 });
    expect(spy.calledOnce).to.equal(false);
    wrapper.setProps(
      {
        ...minProps,
        cursorPosition: {
          isOutside: false,
        },
      },
    );
    expect(spy.calledOnce).to.equal(true);
    expect(wrapper).to.have.length(1);
  });
});
