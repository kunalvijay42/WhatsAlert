require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")  //mechanism by which a front-end client can make requests for resources to an external back-end server

//APP config
const app = express() //Object of express
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

//DB config
// mongoose.connect('mongodb://localhost:27017/reminderAppDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, () => console.log("DB connected"))
mongoose.connect("mongodb+srv://" + process.env.USERNAMEE + ":" + process.env.PASSWORD + "@cluster0.0mx8qku.mongodb.net/reminderAppDB"
    , { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("DB connected"));
const reminderSchema = new mongoose.Schema({
    reminderMsg: String,
    remindAt: String,
    isReminded: Boolean  //To confirm whether reminder has been reminded or not
})
const Reminder = new mongoose.model("reminder", reminderSchema)


//Whatsapp reminding functionality

setInterval(() => {
    Reminder.find({}, (err, reminderList) => {
        if (err) {
            console.log(err)
        }
        if (reminderList) {
            reminderList.forEach(reminder => {
                if (!reminder.isReminded) {
                    const now = new Date()
                    if ((new Date(reminder.remindAt) - now) < 0) {  //It is a past time or current time so trigger alert
                        Reminder.findByIdAndUpdate(reminder._id, { isReminded: true }, (err, remindObj) => {
                            if (err) {
                                console.log(err)
                            }
                            const accountSid = process.env.ACCOUNT_SID
                            const authToken = process.env.AUTH_TOKEN
                            const client = require('twilio')(accountSid, authToken);
                            client.messages
                                .create({
                                    body: reminder.reminderMsg,
                                    from: 'whatsapp:+14155238886',
                                    to: 'whatsapp:+918178050765' //YOUR PHONE NUMBER INSTEAD OF 8888888888
                                })
                                .then(message => console.log(message.sid))
                                .done()
                        })
                    }
                }
            })
        }
    })
}, 1000)
    ;


//API routes
app.get("/getAllReminder", (req, res) => {
    Reminder.find({}, (err, reminderList) => {
        if (err) {
            console.log(err)
        }
        if (reminderList) {
            res.send(reminderList)
        }
    })
})
app.post("/addReminder", (req, res) => {
    const { reminderMsg, remindAt } = req.body
    const reminder = new Reminder({
        reminderMsg,
        remindAt,
        isReminded: false
    })
    reminder.save(err => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect("/getAllReminder");
        }
        // Reminder.find({}, (err, reminderList) => {
        //     if (err) {
        //         console.log(err)
        //     }
        //     if (reminderList) {
        //         res.send(reminderList)
        //     }
        // })
    })

})
app.post("/deleteReminder", (req, res) => {
    Reminder.deleteOne({ _id: req.body.id }, () => { //Deleting based on ID
        Reminder.find({}, (err, reminderList) => {
            if (err) {
                console.log(err)
            }
            if (reminderList) {
                res.send(reminderList)
            }
        })
    })
})

app.listen(9000, () => console.log("Be started"))