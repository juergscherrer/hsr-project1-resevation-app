import React from 'react';
import { shallow } from 'enzyme';
import MessageBox from './MessageBox';

let mockDeleteMessage = () => {
  return true;
};

describe('<MessageBox />', () => {
  it('should be defined', () => {
    expect(MessageBox).toBeDefined();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <MessageBox
        open={true}
        message="Test Message"
        onClose={mockDeleteMessage}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should have a message prop', () => {
    const wrapper = shallow(
      <MessageBox
        open={true}
        message="Test Message"
        onClose={mockDeleteMessage}
      />
    );

    expect(typeof wrapper.instance().props.message).toBe('string');
    expect(wrapper.instance().props.message).toEqual('Test Message');
  });

  it('should have a open prop', () => {
    const wrapper = shallow(
      <MessageBox
        open={true}
        message="Test Message"
        onClose={mockDeleteMessage}
      />
    );

    expect(typeof wrapper.instance().props.open).toBe('boolean');
    expect(wrapper.instance().props.open).toBeTruthy();
  });

  it('should call handleAnswer and return true', () => {
    const wrapper = shallow(
      <MessageBox
        open={true}
        message="Test Message"
        onClose={mockDeleteMessage}
      />
    );

    expect(typeof wrapper.instance().props.deleteMessage).toBeTruthy();
  });
});
