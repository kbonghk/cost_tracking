const mongoose = require('mongoose')

const masterSchema = new mongoose.Schema({
    type: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: String,
        required: false
    },
    unit: {
        type: String,
        required: false
    },
    remark: { type: String }
})

// const Master = mongoose.model('Master', masterSchema)
module.exports = { masterSchema }