import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

if (process.env.NODE_ENV === 'development') {
  import('./msw').then(({ worker }) => worker.start());
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
