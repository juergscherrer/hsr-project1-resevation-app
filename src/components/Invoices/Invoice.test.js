import React from 'react';
import { shallow } from 'enzyme';
import Invoice from './Invoice';

describe('<Invoice />', () => {
  it('should be defined', () => {
    expect(Invoice).toBeDefined();
  });

  it('should render correctly', () => {
    const wrapper = shallow(<Invoice />);
    expect(wrapper).toMatchSnapshot();
  });
});
