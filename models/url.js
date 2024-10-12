import mongoose from "mongoose";
import shortid from "shortid";

const urlScheme = new mongoose.Schema({
    original: {
        type: String,
        require: true
    },
    encurtado: {
        type: String,
        require: true,
        default: shortid.generate
    },
    visitas: {
        type: Number,
        require: true,
        default:0
    },
    data: {
        type: Date,
        require: true,
        default: new Date
    }
});

export default mongoose.model('urlScheme', urlScheme);