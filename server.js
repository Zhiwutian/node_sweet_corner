const express = require('express');
const { StatusError } = require("./helpers/error_handlng");
const PORT = process.env.PORT || 3001;

global.__root = __dirname;
global.StatusError = StatusError;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());


require("./routes")(app)


app.listen(PORT, () => {
    console.log('Server running at localhost:' + PORT);
});
