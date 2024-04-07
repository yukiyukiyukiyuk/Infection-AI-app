import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '../App.css';
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';

Amplify.configure(config);

const App = ({ signOut, user }) => {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [maxProbability, setMaxProbability] = useState(1);

  const labels = ['Acanthamoeba', 'Bacterial', 'Others', 'Fungal', 'Viral'];

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result.replace(/\s/g, '').split(',')[1];
      const fileName = image.name; // Get the name of the file

      // Use another try-catch for the fetch operation
      (async () => {
        try {
          const response = await fetch('https://zmxyb0tmw6.execute-api.ap-northeast-1.amazonaws.com/test', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: base64Image, fileName: fileName, userName: user.username }),
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const result = await response.json();
          setResponse(result);
          console.log(result);
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to upload the image.');
        }
      })();
    };

    reader.readAsDataURL(image);
  };

  useEffect(() => {
    if (response) {
      const newMaxProbability = Math.max(...response.probabilities);
      setMaxProbability(newMaxProbability);
    }
  }, [response]);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {image && (
        <div>
          <p className="selected-file">Selected file: {image.name}</p>
          <img src={URL.createObjectURL(image)} alt="Selected" />
        </div>
      )}
      {response && (
        <div>
          <p className="result-text">
            The highest probability result is "{labels[response.probabilities.indexOf(maxProbability)]}".
          </p>
          {labels.map((label, index) => (
            <div className="probability-bar-container" key={index}>
              <p className="probability-label">
                {label}: {response.probabilities[index]}
              </p>
              <div
                className="probability-bar"
                style={{
                  width: `${(response.probabilities[index] / maxProbability) * 100}%`,
                }}
              ></div>
            </div>
          ))}
        </div>
      )}
      {/* Add a footer if you like */}
      <footer>
        © 2024 TE-ICT
      </footer>
    </div>
  );
};

export default withAuthenticator(App);