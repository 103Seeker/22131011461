import React, { useState } from 'react';
import URLShortenerForm from './components/URLShortenerForm';
import URLStatsPage from './components/URLStatsPage';
import { Container, Button, Box } from '@mui/material';

function App() {
  const [view, setView] = useState('shorten');

  return (
    <Container>
      <Box sx={{ mt: 2, mb: 4 }}>
        <Button
          variant={view === 'shorten' ? 'contained' : 'outlined'}
          onClick={() => setView('shorten')}
          sx={{ mr: 2 }}
        >
          Shorten URL
        </Button>
        <Button
          variant={view === 'stats' ? 'contained' : 'outlined'}
          onClick={() => setView('stats')}
        >
          View Stats
        </Button>
      </Box>

      {view === 'shorten' ? <URLShortenerForm /> : <URLStatsPage />}
    </Container>
  );
}

export default App;
