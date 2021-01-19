import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { spawn } from 'child_process'
import {Gpio} from 'onoff'
import automationSchema from '../Models/AutomationStatus'



const trigger = express.Router()
trigger.use(cors())


// Find the document


trigger.get('/automationstatus', (req, res) => {
    automationSchema.findOne({ value: "status" }, function (err, result) {
        if (result) {
            res.json({ status: 200, data: { value: result.status } })
        }
        if (err) {
            res.json({ status: 500, data: err })
        }
    })
})
trigger.get('/lastwatered', (req, res) => {
    automationSchema.findOne({ value: "last_watered" }, function (err, result) {
        if (result) {
            res.json({ status: 200, data: { value: result.time } })
        }
        if (err) {
            res.json({ status: 500, data: err })
        }
    })
})

trigger.post("/controlautomation", (req, res) => {
    var value = req.body.value
    if (value == 'on') {
        const process = spawn("sh", ["-c", "echo Jcs99hdl! | sudo -S bash -c './startProcess.sh'"]);

        automationSchema.findOneAndUpdate({ value: 'status' }, { status: 'on' }, { new: true, upsert: true }, function (error, result) {
            if (error) {
                console.log(error)

            }
            // do something with the document
        });
        res.json({ status: 200, data: "Automation has started successfully" })
    }
    else if (value == 'off') {
        const process = spawn("sh", ["-c", "echo Jcs99hdl! | sudo -S bash -c 'pkill -f automated.py'"]);
        const endprocess = spawn("sh", ["-c", "echo Jcs99hdl! | sudo -S bash -c 'python3 disableautomation.py'"]);
        setTimeout(() => {
          var pump = new Gpio(23, 'in')  
          pump.unexport();
        }, 2000);
        automationSchema.findOneAndUpdate({ value: 'status' }, { status: 'off' }, { new: true, upsert: true }, function (error, result) {
            if (error) {
                console.log(error)

            }
            // do something with the document
        });
        res.json({ status: 200, data: "Automation has ended successfully" })
    }
    else {
        res.json({ status: 500, data: "Internal Error/Invalid Command" })
    }
})



module.exports = trigger