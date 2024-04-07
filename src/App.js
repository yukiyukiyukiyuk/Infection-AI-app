import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUpload from './components/ImageUpload';
import TemplateDisplay from './components/TemplateDisplay';
import './App.css'; // 確認してください、これがApp.cssファイルをインポートしています。

Amplify.configure(config);

function App({ signOut, user }) {
  return (
    <div className="app-container">
      <Router>
        <Header user={user} signOut={signOut}/> {/* Pass user and signOut props to Header */}
        <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/template-display" element={<TemplateDisplay userName={user.username} />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default withAuthenticator(App);