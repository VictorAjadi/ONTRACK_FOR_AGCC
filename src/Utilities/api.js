import axios from "axios";
import { getCookie } from "./resuable";
//import { getCookie } from "./resuable";

export async function signUpUser(creds) {
   try{
      const data = await axios.post(`/api/user/signup`,creds)
     return data
   }catch(error){
      return {error};
   }

}
export async function loginUser(creds) {
   try{
      const data = await axios.post(`/api/user/login`,creds)
     return data
   }catch(error){
      return {error};
   }

}
export async function barcodeLogin(id) {
   try{
      const data = await axios.post(`/api/user/barcode/login/${id}`)
     return data
   }catch(error){
      return {error};
   }

}
export async function resetPassword(resetToken,creds) {
   try{
      const data = await axios.patch(`/api/user/reset/password/${resetToken}`,creds)
     return data
   }catch(error){
      return {error};
   }

}
export async function forgotPassword(email) {
   try{
      const data = await axios.post(`/api/user/forgot/password`,{email})
     return data
   }catch(error){
      return {error};
   }

}
export async function updateUserDetails(creds) {
   try{
      const token = await getCookie();
      const data = await axios.patch(`/api/user/details`,creds,{headers:
         {
            'Authorization': `Bearer ${token}`
          }
         })
     return data
   }catch(error){
      return {error};
   }
}
export async function getOneUser() {
   try{
      const token = await getCookie();
      const {data} = await axios.get(`/api/user/one`,{headers:
         {
            'Authorization': `Bearer ${token}`
          }
         })
     // console.log(data)
     return data
   }catch(error){
      return {error};
   }
}
export async function deleteUser() {
   try{
      const token = await getCookie();

      const data = await axios.delete(`/api/user/account`,{headers:
         {
            'Authorization': `Bearer ${token}`
          }
         })
     return data
   }catch(error){
      return {error};
   }
}
export async function getUserWithId(id) {
   try{
      const {data} = await axios.get(`/api/user/by/${id}`)
     return data
   }catch(error){
      return {error};
   }
}