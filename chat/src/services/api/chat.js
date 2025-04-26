
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
export const getLatestMessagesBulk = async (chatIds) => {
    try {
      const response = await fetch(
        'http://localhost:5000/messages/latest',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatIds })
        }
      )
      const data = await response.json()
      return {
        success: response.ok,
        data: data.latest   // { chatId: { content, ... }, … }
      }
    } catch (e) {
      return { success: false, data: {} }
    }
}

