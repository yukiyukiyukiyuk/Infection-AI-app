import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '../App.css';
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';
import mainImage from '../img/main.png'; // 画像のパスを確認してください
import supportImage from '../img/support.png'; // 画像のパスを確認してください

Amplify.configure(config);

const labels = ['Acanthamoeba', 'Bacterial', 'Others', 'Fungal', 'Viral'];

const App = ({ signOut, user }) => {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [sortedProbabilities, setSortedProbabilities] = useState([]);
  const [showDefaultImage, setShowDefaultImage] = useState(true);
  const [showSupportImage, setShowSupportImage] = useState(false); // Support image visibility state

  useEffect(() => {
    let hideTimer; // hideTimer variable declared at the top level of useEffect

    // Set a timeout to show the support image after 1 second
    const showTimer = setTimeout(() => {
      setShowSupportImage(true);

      // Set another timeout to hide the support image after 4 seconds
      hideTimer = setTimeout(() => {
        setShowSupportImage(false);
      }, 6000);
    }, 1000);

    // Cleanup function to clear the timeouts when the component unmounts
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer); // Clear hideTimer correctly
    };
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setShowDefaultImage(false); // 画像が選択されたらデフォルト画像を非表示にする
    }
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

      {showDefaultImage && !image && (
        <div className="default-image-container">
          <img src={mainImage} alt="Default" />
        </div>
      )}

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
                  width: `${item.probability / sortedProbabilities[0].probability * 100}%`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {showSupportImage && (
        <div className="support-image-container" style={{ 
          width: '20%', 
          position: 'absolute', // 位置を絶対位置指定で調整できるようにする
          top: '11%',          // 上から50%の位置に
          left: '65%',         // 左から50%の位置に
          transform: 'translate(-50%, -50%)' // トップとレフトの正確な中心を指定
        }}>
          <img src={supportImage} alt="Support the AI Project" style={{ 
            width: '100%'       // コンテナに合わせて画像を拡大縮小
          }} />
        </div>
      )}

      {/* Place for additional components or content */}
    </div>
  );
};

export default withAuthenticator(App);
