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
        />
      </div>
    </div>
  )

}
export default Upload
