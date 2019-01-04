import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import renderer from 'react-test-renderer';

test('Link changes the class when hovered', () => {
  const component = renderer.create(<Snackbar />);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
