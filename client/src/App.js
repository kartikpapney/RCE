import React, { useState } from 'react';
import Table from 'antd/es/table/Table'
import TextArea from './components/TextArea';
import { callApi } from './utils/callApi';
import {PROGRESS_MESSAGE, INPUT_MESSAGE, OUTPUT_MESSAGE} from './utils/constants'
import './App.css';


function App() {
  const [query, setQuery] = useState('');
  const [columns, setColumns] = useState([
    {
      title: 'Output',
      dataIndex: 'Output'
    }
  ]);
  const [data, setData] = useState([
    {'Output': OUTPUT_MESSAGE}
  ])
  const [isLoading, setIsLoading] = useState(false);

  const executeQuery = async () => {
    setIsLoading(true);
    try {
      const [list, cols] = await callApi({query})
      setColumns(cols);
      setData(list)
    } catch (error) {
      setColumns([{
        title: 'Output',
        dataIndex: 'Output'
      }]);
      setData([
        {'Output': error?.response?.data?.res || 'Unexpected Error!!'}
      ])
    }
    setIsLoading(false);
  };


  return (
    <div className="App">
      {isLoading ? (
           <div className="progress-container">
              <div className="progress-bar">
                <p>{PROGRESS_MESSAGE}</p>
              </div>
            </div>
        ) : (
          <div className="two-column-layout">
            <div className="left-section">
              <TextArea value={query} 
              onChange={(e) => {
                setQuery(e.target.value);
              }} 
              placeholder={INPUT_MESSAGE} />
              <button onClick={executeQuery}>Run</button>
            </div>
            <div className="right-section">
              <Table columns={columns} 
              dataSource={data} 
              scroll={{ y: 500, x: data.length * 10 }}
              rowKey={(row, idx) => idx} />
            </div>
          </div>
        )}
    
  </div>
  );
}

export default App;