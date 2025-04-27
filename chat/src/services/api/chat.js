

let chatCache = null               
const messageCache = {}        

export const getChats = async () => {
  if (chatCache) {
    return { success: true, data: chatCache }
  }
  try {
    const res = await fetch('http://localhost:5000/chats', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const json = await res.json()

    if (res.ok) {
      chatCache = json.chats    
      return { success: true, data: chatCache }
    } else {
      return { success: false, data: [] }
    }
  } catch (e) {
    return { success: false, data: [], error: e.toString() }
  }
}

export const getChatMessages = async (chatId) => {

  if (messageCache[chatId]) {
    return { success: true, data: messageCache[chatId] }
  }

  try {
    const res = await fetch(`http://localhost:5000/messages/${chatId}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const json = await res.json()

    if (res.ok) {
      messageCache[chatId] = json.messages  
      return { success: true, data: messageCache[chatId] }
    } else {
      return { success: false, data: [] }
    }
  } catch (e) {
    return { success: false, data: [], error: e.toString() }
  }
}


export const postNewMessage= async(chatId,content)=>{
    try{
      const response=await fetch(`http://localhost:5000/messages/${chatId}`,{
        method:'POST',
        credentials:"include",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          content:content
        })
      })
      const data=await response.json()
      if(response.status===200){
        return {success:true,message:data.message}
      }
      else{
        return {success:false,message:data.message}
      }
    }
    catch(e){
      return {success:false,message:`Something went wrong. Try again later ${e}`}
    }
}