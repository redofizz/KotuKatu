import React from "react";
import Home from "../../pages/index";
import renderer from 'react-test-renderer';

test('Home', () => {
  const component = renderer.create(<Home />);
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});