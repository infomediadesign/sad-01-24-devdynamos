import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthForm from './AuthForm';
import { authenticateUser } from '../services/authService';

// Mock the `authenticateUser` function
jest.mock('../services/authService', () => ({
  authenticateUser: jest.fn(),
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('AuthForm', () => {
  const onLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    (authenticateUser as jest.Mock).mockReset();
    (require('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders login form by default', () => {
    render(<AuthForm onLogin={onLogin} />, { wrapper: MemoryRouter });

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/age/i)).not.toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('switches to registration form', () => {
    render(<AuthForm onLogin={onLogin} />, { wrapper: MemoryRouter });
  
    fireEvent.click(screen.getByText(/need an account\? sign up here\./i));
  
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/age/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
  

  it('shows error message when age is negative', () => {
    render(<AuthForm onLogin={onLogin} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/need an account\? sign up here\./i));
    fireEvent.change(screen.getByPlaceholderText(/age/i), { target: { value: '-1' } });

    expect(screen.getByText(/age cannot be negative/i)).toBeInTheDocument();
  });

  it('calls onLogin and navigates on successful login', async () => {
    (authenticateUser as jest.Mock).mockResolvedValue({ jwt_token: 'fake_token' });

    render(<AuthForm onLogin={onLogin} />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => expect(onLogin).toHaveBeenCalledWith('fake_token'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/testuser');
  });

  it('shows registration success message and switches to login form', async () => {
    (authenticateUser as jest.Mock).mockResolvedValue({ message: 'Registration successful' });

    render(<AuthForm onLogin={onLogin} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/need an account\? sign up here\./i));
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'email@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/age/i), { target: { value: '20' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(screen.getByText(/registration successful! please log in\./i)).toBeInTheDocument());
    expect(screen.queryByPlaceholderText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/age/i)).not.toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    (authenticateUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    render(<AuthForm onLogin={onLogin} />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument());
  });
});
