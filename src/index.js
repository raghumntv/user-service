const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const app = express();


const port = process.env.PORT
app.use(express.json());
app.use(userRouter);

app.listen(port || 3000,()=>{
    console.log(`server is on port ${port||3000}`)
})