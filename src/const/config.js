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
        column : "api/v1/table/back/column",
        content : "api/v1/content/back/content"
    },
    fronts:{
        character: "/api/v1/authority/front/character",
        authority: "/api/v1/authority/front/authority",
        human:"/api/v1/organization/front/human",
        depart:"/api/v1/organization/front/depart",
        section:"/api/v1/organization/front/section",
        content:"/api/v1/content/front/content",
        file:"/api/v1/content/front/file"
    }
}