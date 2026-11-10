import { create } from 'axios'
import React, { createContext, useEffect, useState, type ReactElement, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom';
import { string } from 'zod';


interface authContextType{
  token : string | null;
  addDataToToken : (tkn : string)=> void;

  removeToken : ()=> void;
}

export  let authCreatedContext = createContext <authContextType>({
  token : null,
  addDataToToken(tkn : string) {},
  removeToken() {},
});

interface AuthContextPropsType{

  children : ReactNode
}

 
export default function AuthContext(props  : AuthContextPropsType ) {

  console.log(props);
  

const [token, setToken] = useState(   function() { return  localStorage.getItem("token")  }   )








function addDataToToken(tkn : string) {

setToken(tkn)

localStorage.setItem("token" , tkn)
}

function removeToken(){

  localStorage.removeItem("token")
  setToken(null)
  
}

  return (
    <authCreatedContext.Provider value = {{token ,addDataToToken ,removeToken }} >


     {props.children}
    </authCreatedContext.Provider>
  )
}
