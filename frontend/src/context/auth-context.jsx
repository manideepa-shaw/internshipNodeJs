import { createContext } from "react";

export const AuthContext = createContext({
    userId : null,
    userIdGiven : null,
    adminType : null,
    token: null,
    logging: ()=>{},
    logout:()=>{}
})