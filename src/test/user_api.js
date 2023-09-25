const fetch = require('node-fetch');


const getUsers = async()=>{
    const response = await fetch('https://user-task-3kj1.onrender.com/users');
    const data = await response.json();
    console.log(data);
    if(response.status!==200){
        throw new Error("incorrect status code")
      }
}
getUsers()

