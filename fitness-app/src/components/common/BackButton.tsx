// common/BackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  const username= localStorage.getItem('username')
  const handleClick = () => {
    navigate(`/dashboard/${username}/*`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      Back to Dashboard
    </button>
  );
};

export default BackButton;
