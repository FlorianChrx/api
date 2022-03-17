const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const routing = require('./routes/router');
const app = express();
const PORT = 9090;

const corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

routing.initRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

