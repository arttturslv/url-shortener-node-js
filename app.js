import express from "express";
import { config as env_config } from "dotenv";
import mongoose from "mongoose";

env_config();
mongoose.connect(process.env.MONGO_DB);

const app = express();

app.get('/', (req, res) => {
    return "Hello World."
});


app.listen(process.env.PORT || 3333);



