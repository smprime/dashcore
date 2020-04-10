const express = require('express');
const compression = require('compression');

const CONTEXT = `/${process.env.CONTEXT || ''}`;
const PORT = process.env.PORT || 4000;
const dirName = express.static(__dirname + '/dist/dashcore');
const app = express();
app.use(compression());
app.use(CONTEXT, dirName);
app.use('/', dirName);
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}${CONTEXT}`));