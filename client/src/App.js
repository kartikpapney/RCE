import React, { useState } from 'react';
import Table from 'antd/es/table/Table'
import axios from 'axios';
import TextArea from './components/TextArea';
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
    {'Output': "You'll get your response here!!"}
  ])
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const executeQuery = async () => {
    try {
      const BASE_URL = `${process.env.REACT_APP_NODE_SERVER_HOST}/`
      const instance = axios.create({
          withCredentials: true,
          baseURL: BASE_URL,
          'Content-Type': 'application/json'
      })
      const response = (await instance.post('/', { query })).data;
      const list = response.res || [];
      var firstObject = {};
      if(typeof list === 'object') {
        if(!Array.isArray(list)) {
          firstObject = list;
        } else {
          firstObject = list[0];
        }
      } else {
        firstObject = {
          'Output': list
        }
      }
      const cols = [];
      for(const key in firstObject) {
        cols.push({
          title: key,
          dataIndex: key
        })
      }
      setColumns(cols);
      setData(response.res)
    } catch (error) {
      setColumns([{
        title: 'Output',
        dataIndex: 'Output'
      }]);
      setData([
        {'Output': error?.response?.data?.res || 'Unexpected Error!!'}
      ])
    }
  };


  return (
    <div className="App">
      <div className="two-column-layout">
        <div className="left-section">
          
          <TextArea value={query} onChange={handleQueryChange} placeholder="Your SQL Query ..."></TextArea>
          <button onClick={executeQuery}>Run</button>
        </div>
        <div className="right-section">
            <Table columns={columns} dataSource={data} scroll={{y: 500, x: data.length*10}} />
        </div>
      </div >
    </div>
  );
}

export default App;