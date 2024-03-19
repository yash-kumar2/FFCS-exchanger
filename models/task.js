const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
    slot: {
        type:String,
        required: true,

    },
    faculty: {
        type: String,
        
        
    },
    venue:{
        type:String,
    },
    coursecode:{
        type:String,
        required: true,
    },
    scheduled: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    contact:{

        type:String,
        
    }
})

module.exports = Task