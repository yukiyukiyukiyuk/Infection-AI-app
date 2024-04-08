import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '../App.css';
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';

Amplify.configure(config);

// `labels`配列はコンポーネントの外部に定義されています。
const labels = ['Acanthamoeba', 'Bacterial', 'Others', 'Fungal', 'Viral'];

const App = ({ signOut, user }) => {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [sortedProbabilities, setSortedProbabilities] = useState([]);

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
      const fileName = image.name;

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
    if (response && response.probabilities) {
      const probabilitiesWithLabels = labels.map((label, index) => ({
        label,
        probability: response.probabilities[index],
      }));

      const sorted = probabilitiesWithLabels.sort((a, b) => b.probability - a.probability);
      setSortedProbabilities(sorted);
    }
  }, [response]);

  return (
    <div className="App">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="upload-form">
          <label className="custom-file-upload button-diagnosis">
            <input type="file" className="hidden" onChange={handleImageChange} />
            Upload
          </label>
          <button type="submit" className="button-diagnosis">AI Diagnosis</button>
        </form>
      </div>
      {image && (
        <div>
          <p className="selected-file">Selected file: {image.name}</p>
          <img src={URL.createObjectURL(image)} alt="Selected" />
        </div>
      )}
      {sortedProbabilities.length > 0 && (
        <div className="results-container">
          {sortedProbabilities.map((item, index) => (
            <div className="probability-bar-container" key={index}>
              <p className="probability-label">
                {item.label}: {Math.round(item.probability * 100)}%
              </p>
              <div
                className="probability-bar"
                style={{
                  width: `${(item.probability / sortedProbabilities[0].probability) * 100}%`,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default withAuthenticator(App);
