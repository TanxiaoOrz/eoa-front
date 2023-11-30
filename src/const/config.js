export default {
    backUrl : 'http://localhost:8080',
    getTokens : () =>{
        return localStorage.getItem("tokens");
    },
    saveTokens : (tokens) => {
        localStorage.setItem("tokens",tokens);
    },
    backs:{
        table : "api/v1/table/back/table",
        module : "api/v1/table/back/module",
        column : "api/v1/table/back/column"
    },
    fronts:{
        character: "/api/v1/front/authority/character",
        authority: "/api/v1/front/authority/authority",
        human:"/api/v1/organization/front/humnan",
        depart:"/api/v1/organization/front/depart",
        section:"/api/v1/organization/front/section"
    }
}