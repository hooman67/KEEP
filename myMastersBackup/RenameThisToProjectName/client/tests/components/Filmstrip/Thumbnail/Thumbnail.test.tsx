import { shallow } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import Thumbnail from '../../../../src/components/Filmstrip/Thumbnail/Thumbnail';
import { IThumbnail } from '../../../../src/components/Filmstrip/types';

const defaultProps: IThumbnail = {
  dimensions: {
    height: 100,
    width: 100,
  },
  src: 'https://www.google.ca/',
};

describe('Thumbnail Component Test', () => {
  it('can render Thumbnail component', () => {
    const wrapper = shallow(<Thumbnail {...defaultProps} />);
    expect(wrapper.type()).to.eql('img');
    expect(wrapper.props().style).to.eql({ height: 100, width: 100 });
    expect(wrapper.props().src).to.eql('https://www.google.ca/');
  });
});
