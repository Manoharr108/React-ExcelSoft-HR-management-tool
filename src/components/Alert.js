import React, { useEffect, useState } from 'react';

const Alert = ({ text, type, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (text) {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();  
      }, 3000);

      return () => clearTimeout(timeout); 
    }
  }, [text, onDismiss]);

  return (
    visible && (
      <div
        className={`alert alert-${type || 'primary'}`}
        role="alert"
        style={{
          position: 'fixed',
          zIndex: 121,
          right: '85px',
          top: '186px',
        }}
      >
        {text}
      </div>
    )
  );
};

export default Alert;
