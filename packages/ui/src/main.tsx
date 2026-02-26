import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import './styles/index.css';
// 호스트 프로젝트의 글로벌 CSS를 주입 (Tailwind @theme 등)
import 'virtual:host-css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
