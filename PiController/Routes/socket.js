import express from 'express'
import cors from 'cors'
import { Gpio } from 'onoff'
import automationSchema from '../Models/AutomationStatus'
const socket = express.Router()
socket.use(cors())

socket.post('/motorcontrol', (req, res) => {
    var value = req.body.value
    if (value == 'on') {
        var pump = new Gpio(23, 'out')
        res.json({ status: 200, data: 'success' })
    }
    else if (value == 'off') {
        var pump = new Gpio(23, 'in')
        pump.unexport();
        automationSchema.findOneAndUpdate({ value: 'last_watered' }, { time: new Date() }, { new: true, upsert: true }, function (error, result) {
            if (error) {
                console.log(error)
            }
            // do something with the document
        });
        res.json({ status: 200, data: 'success' })
    }
    else {
        res.json({ status: 500, data: 'InternalError/WrongCommand' })
    }
})


module.exports = socket