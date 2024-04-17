const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
   
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    
    
})

module.exports = Task