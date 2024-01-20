import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders house button', () => {
  render(<App />);
  const linkElements = screen.getAllByRole('link', { name: /house/i });
  expect(linkElements).toHaveLength(2); 
  linkElements.forEach((linkElement) => {
    expect(linkElement).toBeInTheDocument();
  });
});

test('renders senate button', () => {
  render(<App />);
  const linkElements = screen.getAllByRole('link', { name: /senate/i });
  expect(linkElements).toHaveLength(2);
  linkElements.forEach((linkElement) => {
    expect(linkElement).toBeInTheDocument();
  });
});