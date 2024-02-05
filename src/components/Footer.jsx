import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Footer.css'; // CSSファイルをインポートする

const Footer = () => {
  const location = useLocation();

  // 現在のルートに基づいてボタンのラベルとリンク先を決定
  const isHome = location.pathname === '/';
  const buttonLabel = isHome ? 'Question' : 'Home';
  const linkTo = isHome ? '/template-display' : '/';

  return (
    <footer>
      <nav>
        <ul>
          <li>
            {/* ボタンのスタイルを適用するためのクラス名を追加 */}
            <Link to={linkTo} className="centered-button">{buttonLabel}</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;
