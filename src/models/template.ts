import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
    url: String,
    name: String,
    mimetype: String,
    size: String
});

const Template = mongoose.model('Template', templateSchema);

export default Template;