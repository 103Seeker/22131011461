import React from 'react';
import URLShortenerForm from './components/URLShortenerForm';
import URLStatsPage from './components/URLStatsPage';

function App() {
  return (
    <div>
      <h2>URL Shortener</h2>
      <URLShortenerForm />
      <URLStatsPage />
    </div>
  );
}

export default App;
