import axios from "axios";
//import Cookies from "js-cookie";

// Create a history object
export async function getCookie() {
    try{

     let data = await axios.get('/get-token')
     if(data.data.token){
        return data.data.token
     }
     return ''
    }catch(err){
        return ''
    }
  }
export async function removeCookie(){
    await axios.get('/logout')
}