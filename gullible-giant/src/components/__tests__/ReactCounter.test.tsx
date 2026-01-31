import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReactCounter from '../ReactCounter';

describe('ReactCounter', () => {
  it('increments and decrements the count', async () => {
    const user = userEvent.setup();
    render(<ReactCounter initial={2} />);

    const count = screen.getByTestId('count-value');
    expect(count).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: /increase count/i }));
    expect(count).toHaveTextContent('3');

    await user.click(screen.getByRole('button', { name: /decrease count/i }));
    expect(count).toHaveTextContent('2');
  });
});
