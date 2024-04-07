import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import '../App.css';

Modal.setAppElement('#root');

function TemplateDisplay({ userName }) {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedButtons, setSelectedButtons] = useState({ A: false, B: false, C: false });
  const [selectedInfectionButton, setSelectedInfectionButton] = useState('');
  const [selectedSex, setSelectedSex] = useState('');
  const [age, setAge] = useState('');
  const [freeComment, setFreeComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [doctorData, setDoctorData] = useState({ name: '', country: '', hospital: '', position: '', yearsOfService: '' });

  const fetchImages = useCallback(async () => {
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
  }, [userName]);

  useEffect(() => {
    const checkDoctorData = async () => {
      try {
        const response = await fetch('https://sa4mhq95rh.execute-api.ap-northeast-1.amazonaws.com/dev', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName }),
        });
  
        const data = await response.json();
        console.log('Received data:', data); // レスポンスデータを表示
  
        // bodyフィールドをJSONオブジェクトにパース
        const body = JSON.parse(data.body);
  
        // userExistsフィールドがブール型として正しく受け取られているか確認
        const userExists = body.userExists === true || body.userExists === 'true';
  
        if (!userExists) {
          // ユーザーが存在しない場合、ポップアップ画面を表示
          setShowModal(true);
        } else {
          // ユーザーが存在する場合、アンケート画面を表示（ポップアップは表示しない）
          fetchImages();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    checkDoctorData();
  }, [userName, fetchImages]);
  


  const handleModalSubmit = async () => {
    try {
      const response = await fetch('https://uymox3lxaj.execute-api.ap-northeast-1.amazonaws.com/dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName, // ユーザー名を追加
          name: doctorData.name,
          country: doctorData.country,
          hospital: doctorData.hospital,
          position: doctorData.position,
          yearsOfService: doctorData.yearsOfService
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Data successfully submitted!');
        setShowModal(false);
        fetchImages();
      } else {
        alert('Error submitting data: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting data');
    }
  };

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
      await fetchImages();

      if (currentPage < images.length - 1) {
        setCurrentPage(currentPage + 1);
      } else {
        setCurrentPage(0);
      }
      resetAllStates();
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting data');
    }
  };

  const resetAllStates = () => {
    setSelectedButtons({ A: false, B: false, C: false });
    setSelectedInfectionButton('');
    setSelectedSex('');
    setAge('');
    setFreeComment('');
  };

  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <h2>Enter Doctor Data</h2>
        <input
          type="text"
          value={doctorData.name}
          onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
          placeholder="Enter name"
        />
        <input
          type="text"
          value={doctorData.country}
          onChange={(e) => setDoctorData({ ...doctorData, country: e.target.value })}
          placeholder="Enter country"
        />
        <input
          type="text"
          value={doctorData.hospital}
          onChange={(e) => setDoctorData({ ...doctorData, hospital: e.target.value })}
          placeholder="Enter hospital"
        />
        <input
          type="text"
          value={doctorData.position}
          onChange={(e) => setDoctorData({ ...doctorData, position: e.target.value })}
          placeholder="Enter position"
        />
        <input
          type="number"
          value={doctorData.yearsOfService}
          onChange={(e) => setDoctorData({ ...doctorData, yearsOfService: e.target.value })}
          placeholder="Enter years of service"
        />
        <button onClick={handleModalSubmit}>Submit</button>
      </Modal>
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
            {['Smear examination', 'Culture', 'Clinical findings'].map((button) => (
              <button key={button} onClick={() => handleButtonSelect(button)} className={`button ${selectedButtons[button] ? 'selected' : ''}`}>{button}</button>
            ))}
          </div>
          <p>Infection</p>
          <div className="vertical-buttons">
            {['Achanthamoeba', 'Bacterial', 'Fungal', 'Viral', 'Others'].map((button) => (
              <button key={button} onClick={() => handleInfectionButtonSelect(button)} className={`button ${selectedInfectionButton === button ? 'selected' : ''}`}>{button}</button>
            ))}
          </div>
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
