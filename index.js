const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser=require('cookie-parser')




const app = express()
const port = process.env.PORT || 3000
app.use(cookieParser())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

