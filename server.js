const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'docs')));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/index.html'));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`running at port ${PORT}`);
});
