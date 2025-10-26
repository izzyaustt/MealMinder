import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/upload.css';
import icon from '../images/upload.png'; 
import Hamburger from '../components/Hamburger.js';


function Upload2 () {
  const navigate = useNavigate();
  // Removed unused file state variable
  const [message, setMessage] = useState('');
  const [extractedText, setExtractedText] = useState(''); // ← Add this
  const [foodItems, setFoodItems] = useState([]); // ← Add this for food items
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false); // Track if file has been uploaded
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state 

  const API_ENDPOINT = `${process.env.REACT_APP_BACKENDURL || 'http://localhost:3002'}/test`;
  console.log('API endpoint:', API_ENDPOINT);
  
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0]; 
    console.log(uploadedFile);
    // File uploaded successfully

    const formData = new FormData();
    formData.append('receipt', uploadedFile);

    setIsLoading(true);
    setMessage('Uploading and extracting...');
    setExtractedText('');
    setFoodItems([]);
    setIsUploaded(false);

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
      setMessage('Success! Food items extracted from receipt. Please review and submit.');
      setExtractedText(data.rawText || '');
      setFoodItems(data.foodItems || []);
      setIsUploaded(true); // Mark as uploaded successfully
      console.log('Extracted data:', data);
      console.log('isUploaded set to true, foodItems:', data.foodItems);
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

  const handleSubmit = async () => {
    if (!isUploaded || foodItems.length === 0) {
      setMessage('Please upload a file and extract food items first.');
      return;
    }

    setIsSubmitting(true);
    setMessage('Submitting food items to your fridge...');

    try {
      // Save the food items to localStorage so the Fridge component can access them
      const existingItems = JSON.parse(localStorage.getItem('fridgeItems') || '[]');
      const updatedItems = [...existingItems, ...foodItems];
      localStorage.setItem('fridgeItems', JSON.stringify(updatedItems));
      
      setMessage('Successfully added items to your fridge!');
      
      // Navigate to fridge page after a short delay
      setTimeout(() => {
        navigate('/myfridge');
      }, 1500);
      
    } catch (error) {
      console.error('Submit error:', error);
      setMessage(`Error submitting items: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="file-input"
            onChange={handleFileUpload}
            accept="image/*"
            disabled={isLoading}
        />
        {isLoading && <p className="loading">Loading..</p>}

        {message && <p className="message">{message}</p>}

        {foodItems.length > 0 && (
          <div className="extracted-food-items">
            <h3>Extracted Food Items:</h3>
            <div className="food-items-list">
              {foodItems.map((item, index) => (
                <div key={item.id || index} className="food-item-card">
                  <div className="food-item-name">{item.name}</div>
                  <div className="food-item-details">
                    <span className="quantity">Qty: {item.quantity}</span>
                    <span className="expiry">Expires: {item.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Submit Button - only show if file is uploaded and items are extracted */}
            {isUploaded && (
              <div className="submit-section">
                <button 
                  className="submit-button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding to Fridge...' : 'Add Items to Fridge'}
                </button>
              </div>
            )}
            
            {/* Debug info */}
            <div style={{marginTop: '10px', fontSize: '12px', color: '#666'}}>
              Debug: isUploaded={isUploaded.toString()}, foodItems.length={foodItems.length}
            </div>
          </div>
        )}

        {extractedText && (
          <div className="extracted-text">
            <h3>Raw Receipt Text:</h3>
            <pre style ={{whiteSpace: 'pre-wrap', textAlign: 'left', fontSize: '12px', maxHeight: '200px', overflow: 'auto'}}>
              {extractedText}
            </pre>
          </div>
        )}
      </div>
    </div>
  ); 
};


export default Upload2;