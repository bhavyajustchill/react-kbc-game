import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// CSS STYLED-COMPONENTS
import GlobalStyle from './styles/GlobalStyle';
import Typography from './styles/Typography';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <GlobalStyle />
    <Typography />
    <App />
  </React.StrictMode>
);
