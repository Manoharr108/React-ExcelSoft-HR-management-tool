import { useAuth } from "../context/Authcontext"; 
import { useEffect, useState } from 'react';
import Loader from "./Loader";
const Remark = ({ quarter, category, handleAlert }) => {
  const [originalText, setOriginalText] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  // Fetch the current remark on mount
  useEffect(() => {
    const fetchRemark = async () => {
      try {
        const res = await fetch(`http://localhost:9000/getremarks/${quarter}`);
        const data = await res.json();

        const found = data.find(r => r.category.toLowerCase() === category.toLowerCase());
        if (found) {
          setOriginalText(found.text);
          setText(found.text);
        } else {
          setOriginalText('');
          setText('');
        }
      } catch (err) {
        console.error('Error fetching remarks:', err);
        handleAlert('Failed to load remark.', 'danger');
      }
    };

    fetchRemark();
  }, [quarter, category, handleAlert]);

  const handleUpdate = async () => {
    if (!text.trim()) {
      return handleAlert('Please enter some text.', 'danger');
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:9000/remarks/addoredit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quarter, category, text }),
      });

      const data = await response.json();

      if (response.ok) {
        handleAlert('Remark updated successfully!', 'success');
        setOriginalText(text); // reset change detection
      } else {
        handleAlert(data.message || 'Failed to update remark.', 'danger');
      }
    } catch (error) {
      console.error('Error updating remark:', error);
      handleAlert('Network or server error.', 'danger');
    }
    setLoading(false);
  };

  const isChanged = text.trim() !== originalText.trim();

  return (
      
    <div style={{ 
      padding: '32px', 
      margin: '0 auto', 
      width: '87%',
      marginTop:"8px",
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
       {loading && <Loader />}
      <h6>Remarks for this Category:</h6>
      <textarea
        style={{
          width: '100%',
          minHeight: "fitContent",
          padding: '12px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '1.5',
          fontFamily: 'inherit',
          cursor: !isAdmin? 'not-allowed' : 'pointer',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          resize: 'vertical',
          outline: 'none',
          transition: 'all 0.2s ease',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}
        disabled={!isAdmin}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Remarks for: ${category} - ${quarter}`}
        onFocus={(e) => {
          e.target.style.borderColor = '#007bff';
          e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
        }}
      />

      {isAdmin&&<button 
        style={{
          padding: '7px',
          backgroundColor: !isChanged || loading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: !isChanged || loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: !isChanged || loading ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 12px rgba(0, 123, 255, 0.3)',
          fontFamily: 'inherit',
          letterSpacing: '0.5px',
          opacity: !isChanged || loading ? 0.6 : 1
        }}
        disabled={!isChanged || loading}
        onClick={handleUpdate}
        onMouseEnter={(e) => {
          if (!e.target.disabled) {
            e.target.style.backgroundColor = '#0056b3';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!e.target.disabled) {
            e.target.style.backgroundColor = '#007bff';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
          }
        }}
      >
        {loading ? 'Updating...' : 'Update'}
      </button>}
    </div>
  );
};

export default Remark;