import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthContext from './AuthContext';
import HomePage from './HomePage';

describe('HomePage component', () => {
    const mockAuthContextValue = {
        isAuthenticated: false,
        login: jest.fn(),
        logout: jest.fn()
    };

    it('renders welcome message', () => {
        render(
            <AuthContext.Provider value={mockAuthContextValue}>
                <Router>
                    <HomePage />
                </Router>
            </AuthContext.Provider>
        );

        const welcomeMessage = screen.getByText(/Welcome to the FitSync/i);
        expect(welcomeMessage).toBeInTheDocument();
    });

    it('renders Join Now button when user is not authenticated', () => {
        render(
            <AuthContext.Provider value={mockAuthContextValue}>
                <Router>
                    <HomePage />
                </Router>
            </AuthContext.Provider>
        );

        const joinNowButton = screen.getByText(/Join Now/i);
        expect(joinNowButton).toBeInTheDocument();
    });

    it('does not render Join Now button when user is authenticated', () => {
        render(
            <AuthContext.Provider value={{ ...mockAuthContextValue, isAuthenticated: true }}>
                <Router>
                    <HomePage />
                </Router>
            </AuthContext.Provider>
        );

        const joinNowButton = screen.queryByText(/Join Now/i);
        expect(joinNowButton).not.toBeInTheDocument();
    });

    it('renders What We Offer section', () => {
        render(
            <AuthContext.Provider value={mockAuthContextValue}>
                <Router>
                    <HomePage />
                </Router>
            </AuthContext.Provider>
        );

        const whatWeOfferHeading = screen.getByText(/What We Offer/i);
        expect(whatWeOfferHeading).toBeInTheDocument();
    });

    it('renders guiding path to wellness section', () => {
        render(
            <AuthContext.Provider value={mockAuthContextValue}>
                <Router>
                    <HomePage />
                </Router>
            </AuthContext.Provider>
        );

        const guidingPathHeading = screen.getByText(/Guiding your path to wellness/i);
        expect(guidingPathHeading).toBeInTheDocument();
    });
});
