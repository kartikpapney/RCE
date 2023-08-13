import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const executeQuery = async () => {
    try {
      const BASE_URL = `http://${process.env.REACT_APP_NODE_SERVER_HOST}:${ process.env.REACT_APP_NODE_SERVER_PORT}/`
      console.log({BASE_URL});
      const instance = axios.create({
          withCredentials: true,
          baseURL: BASE_URL
      })
      const response = await instance.post('/', { query });
      setResult(JSON.stringify(response.data.res, null, 2));
    } catch (error) {
      setResult('ERROR!!');
    }
  };


  return (
    <div className="App">
      <h1></h1>
      <div className="two-column-layout">
        <div className="left-section">
          <h2>SQL Engine</h2>
          <div>
            <textarea rows="10" cols="50" value={query} onChange={handleQueryChange} placeholder="Type something..."></textarea>
          </div>
          <button onClick={executeQuery}>Run</button>
        </div>
        <div className="right-section">
          <div className="result">
          <pre>
            {result}
          </pre>
        </div>
        </div>
      </div >
      
    </div>
  );
}

export default App;