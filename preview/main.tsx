import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/index.css';
import App from '../src/app/App';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
