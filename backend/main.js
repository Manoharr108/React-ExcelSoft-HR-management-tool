const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/router");
require("dotenv").config();

const port = process.env.PORT || 9000; 

// const corsOptions = {
//     origin: 'http://localhost:3000', 
//     optionsSuccessStatus: 200  
// };
app.use(cors());
// app.use(cors(corsOptions)); 

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/", router);

// Connect to MongoDB
mongoose.connect(process.env.mongoDB)
    .then(() => {
        console.log("Successfully connected to DB!");
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.log("Database connection error: ", err.message);
    });
