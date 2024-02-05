import React, { useState, useEffect } from 'react';
import '../App.css'; // CSSファイルをインポート

function TemplateDisplay({ userName }) {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedButtons, setSelectedButtons] = useState({ A: false, B: false, C: false });
  const [selectedInfectionButton, setSelectedInfectionButton] = useState('');
  const [countryOrRegion, setCountryOrRegion] = useState('');
  const [selectedSex, setSelectedSex] = useState('');
  const [age, setAge] = useState('');
  const [freeComment, setFreeComment] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      if (!userName) return;

      const url = `https://tjzy8324t3.execute-api.ap-northeast-1.amazonaws.com/test`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchImages();
  }, [userName]);

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
    resetAllStates();
  };

  const handlePrevious = () => {
    setCurrentPage(currentPage - 1);
    resetAllStates();
  };

  const handleButtonSelect = (buttonKey) => {
    setSelectedButtons(prevState => ({
      ...prevState,
      [buttonKey]: !prevState[buttonKey],
    }));
  };

  const handleInfectionButtonSelect = (buttonKey) => {
    setSelectedInfectionButton(buttonKey);
  };

  const handleCountryOrRegionChange = (event) => {
    setCountryOrRegion(event.target.value);
  };

  const handleSexSelect = (sex) => {
    setSelectedSex(sex);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleFreeCommentChange = (event) => {
    setFreeComment(event.target.value);
  };

  const handleSubmit = async () => {
    const submissionData = {
      itemId: images.length > 0 ? images[currentPage].id : null,
      selectedButtons,
      selectedInfectionButton,
      countryOrRegion,
      selectedSex,
      age,
      freeComment,
    };

    try {
      const response = await fetch('https://yx8cactixf.execute-api.ap-northeast-1.amazonaws.com/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }
      alert('Data successfully submitted!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting data');
    }
  };

  const resetAllStates = () => {
    setSelectedButtons({ A: false, B: false, C: false });
    setSelectedInfectionButton('');
    setCountryOrRegion('');
    setSelectedSex('');
    setAge('');
    setFreeComment('');
  };

  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <div>
        <button onClick={handlePrevious} disabled={currentPage <= 0}>前のページ</button>
        <button onClick={handleNext} disabled={currentPage >= images.length - 1}>次のページ</button>
      </div>
      {images.length > 0 && currentPage < images.length && (
        <div>
          <h2>{images[currentPage].name}</h2>
          <img src={`data:image/jpeg;base64,${images[currentPage].imageData}`} alt={images[currentPage].name} style={{ maxWidth: '100%', maxHeight: '400px' }} />
          <p>ID: {images[currentPage].id}</p>
          <p>How</p>
          <div className="vertical-buttons">
            {['Smear examination​', 'Culture​', 'Clinical findings​'].map((button) => (
              <button key={button} onClick={() => handleButtonSelect(button)} className={`button ${selectedButtons[button] ? 'selected' : ''}`}>{button}</button>
            ))}
          </div>
          <p>Infection</p>
          <div className="vertical-buttons">
            {['Achanthamoeba​', 'Bacterial​', 'Fungal​', 'Viral​', 'Others​'].map((button) => (
              <button key={button} onClick={() => handleInfectionButtonSelect(button)} className={`button ${selectedInfectionButton === button ? 'selected' : ''}`}>{button}</button>
            ))}
          </div>
          <p>Country / Region</p>
          <input
            type="text"
            value={countryOrRegion}
            onChange={handleCountryOrRegionChange}
            placeholder="Enter country or region"
          />
          <p>Sex</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => handleSexSelect('Male')} className={`button ${selectedSex === 'Male' ? 'selected' : ''}`}>Male</button>
            <button onClick={() => handleSexSelect('Female')} className={`button ${selectedSex === 'Female' ? 'selected' : ''}`}>Female</button>
          </div>
          <p>Age</p>
          <input
            type="number"
            value={age}
            onChange={handleAgeChange}
            placeholder="Enter age"
            min="0"
          />
          <p>Free comment</p>
          <textarea
            value={freeComment}
            onChange={handleFreeCommentChange}
            placeholder="Enter your comment"
            rows="3"
            style={{ width: '80%', boxSizing: 'border-box' }}
          />
          <button onClick={handleSubmit} style={{ marginTop: '20px', marginBottom: '60px' }} className="button" disabled={!selectedInfectionButton}>決定</button>
        </div>
      )}
    </div>
  );
}

export default TemplateDisplay;
