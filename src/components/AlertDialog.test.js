import React from 'react';
import { shallow } from 'enzyme';
import AlertDialog from './AlertDialog';

let mockHandleAnswer = answer => {
  if (answer) {
    return true;
  } else {
    return false;
  }
};

describe('<AlertDialog />', () => {
  it('should be defined', () => {
    expect(AlertDialog).toBeDefined();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <AlertDialog
        open="true"
        text="Test Text"
        handleAnswer={mockHandleAnswer}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should have a text prop', () => {
    const wrapper = shallow(
      <AlertDialog
        open="true"
        text="Test Text"
        handleAnswer={mockHandleAnswer}
      />
    );

    expect(typeof wrapper.instance().props.text).toBe('string');
    expect(wrapper.instance().props.text).toEqual('Test Text');
  });

  it('should have a open prop', () => {
    const wrapper = shallow(
      <AlertDialog
        open="false"
        text="Test Text"
        handleAnswer={mockHandleAnswer}
      />
    );

    expect(typeof wrapper.instance().props.open).toBe('string');
    expect(wrapper.instance().props.open).toEqual('false');
  });

  it('should call handleAnswer and return true', () => {
    const wrapper = shallow(
      <AlertDialog
        open="false"
        text="Test Text"
        handleAnswer={mockHandleAnswer('test answer')}
      />
    );

    expect(typeof wrapper.instance().props.handleAnswer).toBeTruthy();
  });
});
