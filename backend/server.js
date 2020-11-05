require('./config/db/database');
import express from 'express';
import bodyParser from 'body-parser';
import routes from './api';
import path from 'path';
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1", routes);

//static serve
app.use(express.static(path.join(__dirname, '/../')));
app.get('*', (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(`${__dirname}/../index.html`));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server Started at port ${port}`);
});