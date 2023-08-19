import axios from 'axios';
const BASE_URL = `${process.env.REACT_APP_NODE_SERVER_HOST}`;

export const callApi = async (props) => {
  const {query} = props
  try {
    const instance = axios.create({
        withCredentials: true,
        baseURL: BASE_URL,
        'Content-Type': 'application/json'
    })
    const response = (await instance.post('/', { query })).data;
    var list = response.res || [];
    var firstObject = {};
    if(typeof list === 'object') {
      if(!Array.isArray(list)) {
        firstObject = list;
        list = [list];
      } else {
        firstObject = list[0];
      }
    } else {
      firstObject = {
        'Output': list
      }
      list = [firstObject];
    }
    const cols = [];
    for(const key in firstObject) {
      cols.push({
        title: key,
        dataIndex: key
      })
    }
    return [list, cols];
  } catch (error) {
    throw error;
  }
};