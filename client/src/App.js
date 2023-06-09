import './App.css'
import React, { useState, useEffect } from "react"
import axios from "axios"  //For making API calls to third party to fetch data
import DateTimePicker from "react-datetime-picker"
// import DeleteIcon from "@material-ui/icons/Delete";
import DeleteIcon from "@material-ui/icons/Delete";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TodayIcon from '@mui/icons-material/Today';

function App() {

  const [reminderMsg, setReminderMsg] = useState("")
  const [remindAt, setRemindAt] = useState()
  const [reminderList, setReminderList] = useState([])

  useEffect(() => { //Basically it displays all the reminders previously set when page is loaded.
    axios.get("https://whatsalert.onrender.com/getAllReminder").then(res => setReminderList(res.data)) //To perform effect after a component is rendered
  }, []) //If we specify something in box like reminderMsg then whenever thr message gets changed the useEffect does action specified in it.

  const addReminder = () => {
    axios.post("https://whatsalert.onrender.com/addReminder", { reminderMsg, remindAt })
      .then(res => setReminderList(res.data))
    setReminderMsg("")
    setRemindAt()
  }

  const deleteReminder = (id) => {
    axios.post("https://whatsalert.onrender.com/deleteReminder", { id })
      .then(res => setReminderList(res.data))
  }

  return (
    <div className="App">
      <div className="homepage">
        <header>
          <h1>
            <NotificationsActiveIcon />
            WhatsAlert
          </h1>
        </header>
        <div className="homepage_header">
          <h1>Remind Me <TodayIcon className='today' sx={{ fontSize: 30 }} /></h1>
          <input type="text" className="reminder" placeholder=" Add Reminder notes here..." value={reminderMsg} onChange={e => setReminderMsg(e.target.value)} />
          <DateTimePicker className="reminder"
            value={remindAt}
            onChange={setRemindAt}
            minDate={new Date()}  //As we can set reminder for future only.
            minutePlaceholder="mm"
            hourPlaceholder="hh"
            dayPlaceholder="DD"
            monthPlaceholder="MM"
            yearPlaceholder="YYYY"
          />
          <div className="button" onClick={addReminder}>{/*<AddIcon/>*/}<span>Add Reminder</span></div>
        </div>


        <div className="homepage_body">
          {
            reminderList.map(reminder => (
              <div className="reminder_card" key={reminder._id}>  {/* key specified as it helps in mapping*/}
                <h2>Message: <span class="ctext">{reminder.reminderMsg}</span></h2>
                <h3>Reminder Set at:</h3>
                <p>{String(new Date(reminder.remindAt.toLocaleString(undefined, { timezone: "Asia/Kolkata" })))}</p> {/*Setting date as per our time zone */}
                {/* <div className="button" onClick={() => deleteReminder(reminder._id)}>Delete</div> */}
                <button className='del' onClick={() => deleteReminder(reminder._id)}> {/* Deleting based on unique id */}
                  <DeleteIcon />
                </button>
              </div>
            ))
          }



        </div>
      </div>
    </div>
  )
}

export default App;
