import { getCookie } from "../Utilities/resuable";
import { jwtDecode } from "jwt-decode";
import { getUserWithId } from "../Utilities/api";
import { redirect } from "react-router-dom";

export async function Authentication() {
  const token = (await getCookie()).toString();
  //console.log(token)
  let user;
  if (!token) {
    throw redirect("/login")
  }

  const { id } = jwtDecode(token);
  if (!id) {
    throw redirect("/login")
  }
  user = await getUserWithId(id)
  if(user.error){
    throw redirect("/login")
  }
}
