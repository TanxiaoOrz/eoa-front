import React from "react"

const MainPage = () => {
    console.log(window.location.hash)
    return (
        <img src = {require("./img/budgetFishbone.jpg")} width={"100%"} height={"100%"}/>
    )
}

export default MainPage