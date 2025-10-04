import React from 'react';
import { ClipLoader, BounceLoader, PuffLoader } from 'react-spinners';

const LoadingSpinner = ({ 
  size = 40, 
  color = "#007bff", 
  type = "clip",
  text = "Loading...",
  fullScreen = false 
}) => {
  const renderSpinner = () => {
    switch (type) {
      case 'bounce':
        return <BounceLoader size={size} color={color} />;
      case 'puff':
        return <PuffLoader size={size} color={color} />;
      default:
        return <ClipLoader size={size} color={color} />;
    }
  };

  const spinnerContent = (
    <div className={`loading-spinner ${fullScreen ? 'full-screen' : ''}`}>
      {renderSpinner()}
      {text && <div className="loading-text">{text}</div>}
    </div>
  );

  return spinnerContent;
};

export default LoadingSpinner;