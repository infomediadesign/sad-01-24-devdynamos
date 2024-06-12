import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './Dashboard';

jest.mock('./common/NavBar', () => () => <div>Navbar Mock</div>);
jest.mock('./Calories', () => () => <div>Calories Mock</div>);
jest.mock('./images/carousel.png', () => 'carousel.png');

describe('Dashboard component', () => {
  beforeEach(() => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );
  });

  it('renders the Navbar', () => {
    expect(screen.getByText('Navbar Mock')).toBeInTheDocument();
  });

  it('renders the carousel image', () => {
    const carouselImage = screen.getByAltText('Carousel');
    expect(carouselImage).toBeInTheDocument();
    expect(carouselImage).toHaveAttribute('src', 'carousel.png');
  });

  it('renders the Calories component', () => {
    expect(screen.getByText('Calories Mock')).toBeInTheDocument();
  });

  it('renders the heading for hormones section', () => {
    expect(screen.getByText(/How Working Out Affects Good Hormones/i)).toBeInTheDocument();
  });

  it('renders all hormone articles with correct content', () => {
    expect(screen.getByText('Endorphins')).toBeInTheDocument();
    expect(screen.getByText(/Endorphins are known as "feel-good" hormones/i)).toBeInTheDocument();

    expect(screen.getByText('Dopamine')).toBeInTheDocument();
    expect(screen.getByText(/Dopamine plays a crucial role in reward/i)).toBeInTheDocument();

    expect(screen.getByText('Serotonin')).toBeInTheDocument();
    expect(screen.getByText(/Serotonin is a key hormone that stabilizes mood/i)).toBeInTheDocument();

    expect(screen.getByText('Adrenaline')).toBeInTheDocument();
    expect(screen.getByText(/Adrenaline is released in response to stress/i)).toBeInTheDocument();
  });

  it('renders FontAwesome icons in hormone articles', () => {
    expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(5);
  });
});
