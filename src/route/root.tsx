import { loginPost } from "../const/http.tsx";
import config from "../const/config.js";
import React from "react";

export default function Root() {
  let tokens = { tokens: config.getTokens()}
  console.log(tokens)
  loginPost("/api/v1/token/check",tokens).then(
    value =>{
      let exist:boolean = value.data;
      if (exist) {
        window.location.replace("/front#mainPage")
      } else {
        window.location.replace("/login")
      }
    }
  )
  return (
    <h1>ROOT</h1>
  );
}