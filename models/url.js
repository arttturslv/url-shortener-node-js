import mongoose from "mongoose";
import shortid from "shortid";

const URLScheme = new mongoose.Schema({
    originalURL: {
        type: String,
        require: true
    },
    shortLinkId: {
        type: String,
        require: true,
        default: shortid.generate
    },
    views: {
        type: Number,
        require: true,
        default:0
    },
    date: {
        type: Date,
        require: true,
        default: new Date
    }
});

export default mongoose.model('URLScheme', URLScheme);