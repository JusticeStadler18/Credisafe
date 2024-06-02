import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Register from './Frontend';

jest.mock('axios');

describe('Register', () => {
  test('renders Register component', () => {
    render(<Register />);
    const registerElement = screen.getByText(/Register/i);
    expect(registerElement).toBeInTheDocument();
  });

  test('displays error message when passwords do not match', async () => {
    render(<Register />);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password:/i);
    const registerButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Passwords do not match/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('sends registration request when form is submitted', async () => {
    render(<Register />);
    const usernameInput = screen.getByLabelText(/Username:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password:/i);
    const registerButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/register', {
        username: 'testuser',
        password: 'password123'
      });
    });
  });
});