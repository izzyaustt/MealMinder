<<<<<<< HEAD

import { useState } from 'react';
import '../styles/upload.css';
import icon from '../images/upload.png'; 
import Hamburger from '../components/Hamburger.js';


function Upload () {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [extractedText, setExtractedText] = useState(''); // ← Add this
  const [isLoading, setIsLoading] = useState(false); 

  const API_ENDPOINT = `${process.env.REACT_APP_BACKENDURL || 'http://localhost:3002'}/upload`;
  console.log('API endpoint:', API_ENDPOINT);
  
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0]; 
    console.log(uploadedFile);
    setFile(uploadedFile);//updating the file state

    const formData = new FormData();
    formData.append('receipt', uploadedFile);

    setIsLoading(true);
    setMessage('Uploading and extracting...');
    setExtractedText('');

    try{
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
    });
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
          data = await response.json();
      } else {
          const text = await response.text();
          throw new Error(`Unexpected response format: ${text}`);
      }

    //const data = await response.json();
    if (response.ok){
      setMessage('Success');
      setExtractedText(data.text || JSON.stringify(data, null,2));
      console.log('Extracted data:', data);
    }else {
      setMessage(`Error: ${data.error || 'Upload failed'}`)
    } 
  }catch (error){
    console.error('Upload error:', error);
    setMessage(`error: ${error.message}`);
  }finally{
    setIsLoading(false);
  }
  }

  return (
    <div className="file-upload">
      <Hamburger />
=======
import React from 'react';
import '../styles/upload.css';
import icon from '../images/upload.png'; 

function Upload () {

  const handleFileUpload = (event) => {
    const file = event.target.files[0] 
    console.log(file)
  }


  return (
    <div className="file-upload">
>>>>>>> 90d7907e609d7c45cc8145a9582d971783e49bec
        <div className = "upload-container">
          <h1 className="header">Upload Receipt Image</h1>
          <p className="desc">For best results, ensure you are using a plain background and good lighting!</p>
        <div className="upload-icon">
            <img src={icon} alt=""></img>
        </div>

        <input
            type="file"
            className="file-input"
            onChange={handleFileUpload}
<<<<<<< HEAD
            accept ="image/*"
            disabled={isLoading}
        />
        {isLoading && <p className="loading">Loading..</p>}

        {message && <p className="message">{message}</p>}

        {setExtractedText && (
          <div className="extracted-text">
            <h3>Extracted Text:</h3>
            <pre style ={{whiteSpace: 'pre-wrap', textAlign: 'left'}}>
              {extractedText}
            </pre>
          </div>
        )}{}
      </div>
    </div>
  ); 
};


export default Upload;
=======
        />
      </div>
    </div>
  )

}
export default Upload
>>>>>>> 90d7907e609d7c45cc8145a9582d971783e49bec
