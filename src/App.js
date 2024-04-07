import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Header from './components/Footer';
import ImageUpload from './components/ImageUpload';
import TemplateDisplay from './components/TemplateDisplay';
import './App.css'; // 確認してください、これがApp.cssファイルをインポートしています。

Amplify.configure(config);

function App({ signOut, user }) {
  return (
    <div className="app-container"> {/* app-containerスタイルを適用 */}
      <Router>
        <Header /> {/* Headerコンポーネントを追加 */}
        <h1>Hello {user.username}</h1> {/* ユーザー名を表示 */}
        <button onClick={signOut}>Sign out</button> {/* サインアウトボタンを追加 */}
        <Routes>
          <Route path="/" element={<ImageUpload />} /> {/* ImageUploadコンポーネントへのルート */}
          <Route path="/template-display" element={<TemplateDisplay userName={user.username} />} /> {/* TemplateDisplayコンポーネントへのルート、ユーザー名を渡す */}
        </Routes>
      </Router>
    </div>
  );
}

export default withAuthenticator(App);