
export const getChats = async () => {
    try {
      const res = await fetch('http://localhost:5000/chats', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      return {
        success: res.ok,
        data: data.chats || []
      };
    } catch (e) {
      return { success: false, data: [], error: e.toString() };
    }
  };
export const getChatMessages = async (chatIds) => {
    try {
      const response=await fetch(`http://localhost:5000/messages/${chatIds}`,{
        method:"GET",
        headers:{
          'Content-Type':'application/json'
        }
      })
      const data=await response.json()
      if(response.status===200){
        console.log(data)
        return {success:response.ok,data:data.messages}
      }
      else{
        return {success:false, data:[]}
      }
    } catch (e) {
      return { success: false, data: {} }
    }
}

