import React from 'react';
import './footer.css';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <Link to="/" className="footer-brand">© NATURING Inc.</Link>
          <Link to="/">네이처링 주식회사</Link>
          <Link to="/app">App</Link>
          <span className="footer-address">04797 서울시 성동구 아차산로11길 11 408호</span>
          <span className="footer-phone flex items-center">
            <FaPhoneAlt fontSize={11} style={{marginRight:'5px'}}/>
            02-6243-0023
          </span>
          <a href="mailto:support@naturing.net" className="footer-email">
            <MdOutlineEmail/>
            support@naturing.net
          </a>
        </div>

        <div className="footer-right">
          <Link to="/login">로그인</Link>
          <span className="divider">|</span>
          <Link to="/about">© 2024 네이처링 리포트</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
