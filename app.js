import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import urlScheme from './models/url.js'

config();


const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    return "Hello World."
});

app.post('/', async (req, res) => {
    try {
        const urlOriginal = req.body.URL;
        console.log(urlOriginal)
        
        if(!urlOriginal) {
            console.log("Não é possivel completar a requisição, falta o paramentro 'URL': ", urlOriginal);
            return res.sendStatus(400);
        }

        if(!isURLValid(urlOriginal)) {
            console.log("Não é possivel completar a requisição, a URL é inválida: ", urlOriginal);
            return res.sendStatus(400);
        }

        const url = await urlScheme.create({original:urlOriginal});
        res.send(url);

    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
});

app.get('/:urlEncurtada', async (req, res) => {
    try {
        const urlEncurtada = req.params.urlEncurtada;

        const url = await urlScheme.findOne({ encurtado: urlEncurtada});
    
        if(!url) {
            console.log("Não existe a URL encurtada: ", urlEncurtada);
            return res.sendStatus(404);
        }
    
        url.visitas++;
        url.save();
        res.send(url);

    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
});

mongoose.connect(process.env.MONGO_DB)
    .then(() =>
        app.listen(3333, () => {
            console.log("Server is on 🔥")
        })
    ).catch((err)=> {
        console.log(err);
    });

function isURLValid(url) {
    try {
        const urlRecebida = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
        new URL(urlRecebida)
        return true;
    } catch {
        return false;
    }
}