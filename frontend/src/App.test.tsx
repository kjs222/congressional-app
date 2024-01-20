import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test.skip('renders house link', () => {
  render(<App />);
  const linkElement = screen.getByText(/house/i);
  expect(linkElement).toBeInTheDocument();
});
