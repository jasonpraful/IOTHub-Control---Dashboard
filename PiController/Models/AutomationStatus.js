import mongoose from 'mongoose'

const automationSchema = new mongoose.Schema({
    value:{
        type:String,
        default:''
    },
    status: {
        type: String,
        default: 'off'
    },
    time:{
        type: Date,
        default: new Date()
    }

})

module.exports = mongoose.model("connection", automationSchema)