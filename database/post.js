const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    post: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model("post",postSchema);

