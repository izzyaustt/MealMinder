import React from 'react';
import '../styles/upload.css';
import icon from '../images/upload.png'; 
import Hamburger from '../components/Hamburger.js';


function Upload () {
  // const [file, setFile] = useState(null);
  // const [statusMessage, setStatusMessage] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0] 
    console.log(file)

  // // State to manage messages (e.g., success, error)
  // const [message, setMessage] = React.useState('');

  // const API_ENDPOINT = 'YOUR_BACKEND_API_URL/upload-receipt';
  }


  return (
    <div className="file-upload">
      <Hamburger />
        <div className = "upload-container">
          <h1 className="header">Upload Receipt Image</h1>
          <p className="desc">For best results, ensure you are using a plain background and good lighting!</p>
        <div className="upload-icon">
            <img src={icon} alt=""></img>
        </div>

        <input
            type="file"
            // className="file-input"
            onChange={handleFileUpload}
        />
      </div>
    </div>
  )

}
export default Upload
