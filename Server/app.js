const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const { connection } = require("./configurations/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const profileRoutes = require("./routes/profile");

const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression());
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', '*');
//     res.setHeader('Access-Control-Allow-Headers', '*');
//     next();
// });
app.use(cors());
app.use(authRoutes);
app.use('/posts', postRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Crashline." });
});

app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});

connection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}.`);
    });
});