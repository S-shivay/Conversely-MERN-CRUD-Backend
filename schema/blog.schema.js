const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
	    min: 3,
    },
    content:{
        type: String,
        required: true,
	    min: 10,
        },
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Author',
            required:true
        },
    createdAt: {
        type:Date,
        default: Date.now
    },
    updatedAt: {
        type:Date,
        default: Date.now
    },
})



module.exports = mongoose.model('Blog', blogSchema);