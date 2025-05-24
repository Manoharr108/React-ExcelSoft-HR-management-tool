import React from 'react';
import { getEmployeePhotoUrl, getDefaultPhotoUrl } from '../utils/photoUtils';

const EmployeePhoto = ({ 
  empid, 
  name, 
  size = 50, 
  className = '',
  style = {} 
}) => {
  const handleImageError = (e) => {
    e.target.src = getDefaultPhotoUrl();
  };

  return (
    <img
      src={getEmployeePhotoUrl(empid)}
      alt={`${name}'s photo`}
      onError={handleImageError}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: '4px',
        ...style
      }}
    />
  );
};

export default EmployeePhoto;