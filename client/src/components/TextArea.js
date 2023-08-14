import React, { useState } from 'react';
import Input from 'antd/es/input/Input';

const { TextArea } = Input;

const App = (props) => {
  return (
    <>
      <TextArea
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        autoSize={{ minRows: 5, maxRows: 10 }}
      />
    </>
  );
};

export default App;