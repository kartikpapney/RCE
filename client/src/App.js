import React, { useState } from 'react';
import Table from 'antd/es/table/Table'
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([])
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const executeQuery = async () => {
    try {
      const BASE_URL = `${process.env.REACT_APP_NODE_SERVER_HOST}/`
      console.log({BASE_URL});
      const instance = axios.create({
          withCredentials: true,
          baseURL: BASE_URL,
          'Content-Type': 'application/json'
      })
      const response = (await instance.post('/', { query })).data;
      // const response = {"res":[{"Name":"Derp","Address":"ForeverAlone Street","Gender":"Male"},{"Name":"Derpina","Address":"Whiterun Breezehome","Gender":"Female"},{"Name":"Derp","Address":"ForeverAlone Street","Gender":"Male"},{"Name":"Derpina","Address":"Whiterun Breezehome","Gender":"Female"},{"Name":"Derp","Address":"ForeverAlone Street","Gender":"Male"},{"Name":"Derpina","Address":"Whiterun Breezehome","Gender":"Female"}]}
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
          'response': list
        }
      }
      const cols = [];
      for(const key in firstObject) {
        cols.push({
          title: key,
          dataIndex: key
        })
      }
      console.log(response);
      setColumns(cols);
      setData(response.res)
    } catch (error) {
      console.log(error)
      setColumns([{
        title: 'Response',
        dataIndex: 'Response'
      }]);
      setData([
        {'Response': toString(error?.data?.res || 'Unexpected Error')}
      ])
    }
  };


  return (
    <div className="App">
      <div className="two-column-layout">
        <div className="left-section">
        <button onClick={executeQuery}>Run</button>
          <div>
          <textarea rows="10" cols="50" value={query} onChange={handleQueryChange} placeholder="Your SQL Query ..."></textarea>
          </div>
          
        </div>
        <div className="right-section">
          <div className="result">
            <Table columns={columns} dataSource={data} scroll={{y: 10}}/>
        </div>
        </div>
      </div >
      
    </div>
  );
}

export default App;