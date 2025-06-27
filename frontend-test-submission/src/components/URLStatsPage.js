 import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import axios from 'axios';

const URLStatsPage = () => {
  const [shortcode, setShortcode] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const handleFetchStats = async () => {
    setError('');
    setStats(null);

    if (!shortcode) {
      setError('Shortcode is required');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/shorturls/${shortcode}`);
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch stats');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>Check URL Stats</Typography>
        <TextField
          label="Shortcode"
          variant="outlined"
          fullWidth
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleFetchStats}>
          Get Stats
        </Button>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {stats && (
          <Box sx={{ mt: 4 }}>
            <Alert severity="info">
              <strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}<br />
              <strong>Expires At:</strong> {new Date(stats.expiry).toLocaleString()}<br />
              <strong>Total Clicks:</strong> {stats.clickCount}
            </Alert>

            {stats.clicks.length > 0 && (
              <Paper sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User Agent</TableCell>
                      <TableCell>Referrer</TableCell>
                      <TableCell>IP</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.clicks.map((click, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{click.userAgent}</TableCell>
                        <TableCell>{click.referrer || 'N/A'}</TableCell>
                        <TableCell>{click.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default URLStatsPage;

