import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {AppProvider} from './context/AppContext';
import App from './App';
import {ErrorBoundary} from './components/ErrorBoundary';
import './index.css';
import './styles/v5.css';
import './styles/loading.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><AppProvider><ErrorBoundary><App/></ErrorBoundary></AppProvider></BrowserRouter></React.StrictMode>
);
