const fetch = require('node-fetch');


const getUsers = async()=>{
    const response = await fetch('https://user-task-3kj1.onrender.com/users');
    const data = await response.json();
    console.log(data);
    return response
}
const apiResponse=async()=>{
      const timeout= new Promise((_,reject)=>{
        setTimeout(()=>{
          reject(new Error('api response timeoout'))
        },30000)
      })
      try {
        const result=await Promise.race([getUsers(),timeout])
        if(result.status!==200){
          throw new Error("incorrect status code")
        }
      } catch (error) {
        throw error.message
      }
}
apiResponse()

