import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToasterProvider } from '../../src';
import { App } from './App';
import '../../src/fonts/fonts.css';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToasterProvider position="bottom-right">
      <App />
    </ToasterProvider>
  </StrictMode>,
);
