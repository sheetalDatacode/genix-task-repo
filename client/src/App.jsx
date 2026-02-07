import React, { useState, useEffect } from 'react';
import * as ReactWindow from 'react-window';

const List = ReactWindow.FixedSizeList || (ReactWindow.default && ReactWindow.default.FixedSizeList);

function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then(res => {
        if (res.status === 429) throw new Error("RATE_LIMIT_EXCEEDED");
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const Row = ({ index, style }) => (
    <div style={{ ...style, borderBottom: '1px solid #333', color: '#00ff00', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
      [NODE_{items[index]?.id}] Value: {items[index]?.value.toFixed(2)}
    </div>
  );

  if (loading) return <h1 style={{ color: 'white' }}>Initializing Stream...</h1>;
  
  // Show a professional error message if rate limited
  if (error === "RATE_LIMIT_EXCEEDED") {
    return (
      <div style={{ background: 'black', color: 'red', height: '100vh', padding: '20px' }}>
        <h2>⚠️ SECURITY ALERT: RATE LIMIT EXCEEDED</h2>
        <p>Too many requests detected. Please wait 60 seconds before reconnecting.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', height: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#00ff00' }}>AR GENIX REAL-TIME MONITOR</h1>
      {List && items.length > 0 ? (
        <List
          height={window.innerHeight ? window.innerHeight - 150 : 600} // Fix the NaN bug
          itemCount={items.length}
          itemSize={40}
          width={'100%'}
        >
          {Row}
        </List>
      ) : <p style={{color: 'white'}}>No data available.</p>}
    </div>
  );
}

export default App;