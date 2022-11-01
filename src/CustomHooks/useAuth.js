import axios from "axios";
import { useState } from "react"
import { apiBaseUrl } from "../config";

export const useAuth = ()=> {
    const [userEmail,setUserEmail] = useState(null);
    const [user,setUser] = useState(null);
    const [message,setMessage] = useState("");
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openFailure, setOpenFailure] = useState(false);

    const getUser = ()=>{
        axios({
            method: "POST",
            url: `${apiBaseUrl}/user/get`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(userEmail),
          })
            .then((res) => {
                res.data.results ? setUser(res.data.results) : setUser(null);
            })
            .catch((err) => {
                setMessage(err.response.data || "Something Went Wrong. Please Try Again Later!");
            });
    }
    return [setUserEmail,user,getUser,message,openSuccess,setOpenSuccess,openFailure,setOpenFailure];
}