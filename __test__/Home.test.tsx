import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '../src/pages/index';

it('Should render hello text', () => {
  render(<Home />);
  expect(screen.getByText('Nextjs!!')).toBeInTheDocument();
});
