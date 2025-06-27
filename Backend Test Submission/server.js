const express = require('express');
const app = express();
const logger = require('./loggerMiddleware');
const urlRoutes = require('./routes/urlRoutes');

app.use(express.json());
app.use(logger); // Use your logging middleware
app.use('/', urlRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
