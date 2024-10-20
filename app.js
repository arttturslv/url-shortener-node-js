import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import URLScheme from './models/url.js'
import cors from 'cors'

config();

const app = express();

app.use(cors({
    origin: '*',
}));
app.use(express.json());

app.post('/', async (req, res) => {
    try {
        const originalURL = req.body.URL;
        
        if(!originalURL) {
            console.log("Não é possivel completar a requisição, falta o paramentro 'URL': ", urlOriginal);
            return res.sendStatus(400);
        }

        if(!isURLValid(originalURL)) {
            console.log("Não é possivel completar a requisição, a URL é inválida: ", urlOriginal);
            return res.sendStatus(400);
        }

        const url = await URLScheme.create({originalURL:originalURL});
        res.send(url);

    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
});

app.get('/:shortLinkId', async (req, res) => {
    try {
        const shortLinkId = req.params.shortLinkId;

        const url = await URLScheme.findOne({ shortLinkId: shortLinkId});
    
        if(!url) {
            console.log("Não existe a URL encurtada: ", shortLinkId);
            return res.sendStatus(404);
        }
    
        url.views++;
        await url.save();
        res.send(url);

    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
});

app.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await URLScheme.findByIdAndDelete(id);
        res.sendStatus(204)

    } catch (error) {
        console.log(error);
        res.sendStatus(404)
    }
})

mongoose.connect(process.env.MONGO_DB)
    .then(() =>
        app.listen(3333, () => {
            console.log("Server is on 🔥")
        })
    ).catch((err)=> {
        console.log("Erro na conexão com o mongo.");
        console.log(err);
    });

function isURLValid(url) {
    try {
        const receivedURL = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
        new URL(receivedURL)
        return true;
    } catch {
        return false;
    }
}


export default app;