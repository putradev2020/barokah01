import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Roboto:400,900italic,900,700italic,700,500italic,500,400italic,300italic,300,100italic,100');
        
        * {
          box-sizing: border-box;
          margin: 0;
        }
        
        h1, p, h2, h3, h4, ul, li, div {
          margin: 0;
          padding: 0;
        }
        
        .loading-page {
          background: #0d0d0d;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 50;
        }
        
        .counter {
          text-align: center;
          position: relative;
          width: 400px;
        }
        
        .counter p {
          font-size: 40px;
          font-weight: 100;
          color: #f60d54;
          font-family: 'Roboto', sans-serif;
        }
        
        .counter .brand-text {
          font-size: 24px;
          font-weight: 700;
          color: #FFD700;
          font-family: 'Roboto', sans-serif;
          margin-top: 20px;
          letter-spacing: 1px;
          line-height: 1.4;
        }
        
        .counter .logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px auto;
          border-radius: 50%;
        }
        
        .counter h1 {
          color: white;
          font-size: 60px;
          margin-top: -10px;
          font-family: 'Roboto', sans-serif;
        }
        
        .counter hr {
          background: #f60d54;
          border: none;
          height: 1px;
          transition: width 0.05s ease;
        }
        
        .counter h1.abs {
          position: absolute;
          top: 0;
          width: 100%;
        }
        
        .counter .color {
          width: 0px;
          overflow: hidden;
          color: #f60d54;
        }
      `}</style>
      <div className="loading-page">
        <div className="counter">
          <img 
            src="/img/logo.jpeg" 
            alt="Barokah Printer Logo" 
            className="logo"
          />
          <p><b>Loading</b></p>
          <h1>{counter}%</h1>
          <hr style={{ width: `${counter}%` }} />
          <p className="brand-text"><b>Barokah Printer</b><br /><b>Service Printer Terpercaya</b></p>
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;