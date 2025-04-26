
const getChats=async ()=>{
    try{
        const response=await fetch('http://localhost:5000/chats',{
            method:'GET',
            credentials:"include",
            headers:{
              'Content-Type':'application/json'
            }
        })
        const data=await response.json()
        if(response.status===200){
            console.log(data)
          return {success:true,data:data}
        }
        else{
          return {success:false,data:data}
        }
      }
      catch(e){
        return {success:false,data:`Something went wrong. Try again later ${e}`}
      }
}

export default getChats