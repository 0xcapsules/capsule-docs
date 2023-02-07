import React, {useState } from 'react';
import './converterStyle.css';
import {serializeBcs, bcs } from "@capsulecraft/serializer";
import Layout from '@theme/Layout';

export default function Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleSerialize = () => {
    // Your logic for serializing the input goes here
    setOutput(JSON.stringify(serializeText(input)));
  };

  const serializeText = (text: string): number[][] => {
    const serializedData: number[][] = [];
    let text_trimmed =  text.trim();
      if (text_trimmed.slice(0, 1) !== "[" &&  text_trimmed.slice(-1) !== "]"){
        throw new Error("The first and the last characters must be brackets.");
      }
      const encodedData = text.slice(1, text.length -1);
      const regex = /,(?![^\[]*\])/g;
      const items = encodedData.split(regex);
      const pairs = items.map(item => item.split(":"));
      pairs.forEach(([data, type])=>{
        type = type.trim()
        const parsedData = JSON.parse(data);
        console.log(parsedData, type);
        let bytesArray = serializeBcs(bcs, type, parsedData)
        if (type.includes("string") || type.includes("vector")) {
          let {value, length}  = ulebDecode(bytesArray)  
          console.log("ULEB:", value,"LEN", length)
          bytesArray = bytesArray.slice(length, bytesArray.length)
        }
        serializedData.push(bytesArray);
      })
      console.log(serializedData);
   
      return serializedData
  }

  const ulebDecode = (arr: number[] | Uint8Array): {
    value: number;
    length: number;
  } => {
    let total = 0;
    let shift = 0;
    let len = 0;
  
    while (true) {
      let byte = arr[len];
      len += 1;
      total |= (byte & 0x7f) << shift;
      if ((byte & 0x80) === 0) {
        break;
      }
      shift += 7;
    }
  
    return {
      value: total,
      length: len,
    };
  }
  

  return (
    <Layout title="Hello" description="Hello React Page">
    <div className="container">
      <h1>Serialize Text Input</h1>
      <textarea
        id="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button id="serialize-btn" onClick={handleSerialize}>
        Serialize
      </button>
      <h1>Output</h1>
      <textarea id="output" value={output} readOnly />
    </div>
    </Layout>
  );
};
