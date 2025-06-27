import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert
} from '@mui/material';
import axios from 'axios';

const URLShortenerForm = () => {
  const [url, setUrl] = useState('');
  const [validity, setValidity] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!url) {
      setError('URL is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/shorturls', {
        url,
        validity: validity ? parseInt(validity) : undefined,
        shortcode: shortcode || undefined
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>URL Shortener</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Long URL"
            variant="outlined"
            fullWidth
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Validity (in minutes)"
            variant="outlined"
            fullWidth
            type="number"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Custom Shortcode (optional)"
            variant="outlined"
            fullWidth
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Shorten URL
          </Button>
        </form>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {result && (
          <Box sx={{ mt: 4 }}>
            <Alert severity="success">
              <strong>Short Link:</strong>{' '}
              <a href={result.shortLink} target="_blank" rel="noopener noreferrer">
                {result.shortLink}
              </a><br />
              <strong>Expires at:</strong> {new Date(result.expiry).toLocaleString()}
            </Alert>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default URLShortenerForm;
