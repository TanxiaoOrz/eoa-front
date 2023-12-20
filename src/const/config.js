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
        content : "api/v1/content/back/content",
        character : "/api/v1/authority/back/character",
        character_human:"/api/v1/authority/back/character/human",
        character_authority : "/api/v1/authority/back/character/authority",
        character_link : "/api/v1/authority/back/character/link",
        character_drop : "/api/v1/authority/back/character/drop",
        authority : "/api/v1/authority/back/authority",
        human : "/api/v1/organization/back/human",
        depart : "/api/v1/organization/back/depart",
        section : "/api/v1/organization/back/section",
    },
    fronts:{
        character: "/api/v1/authority/front/character",
        authority: "/api/v1/authority/front/authority",
        human:"/api/v1/organization/front/human",
        depart:"/api/v1/organization/front/depart",
        section:"/api/v1/organization/front/section",
        content:"/api/v1/content/front/content",
        file:"/api/v1/content/front/file",
        file_form:"/api/v1/table/front/file",
        upload:"/api/v1/content/front/upload",
        form:"/api/v1/table/front/form",
        formAuthority:"/api/v1/table/front/authoriy"
    },
    globalSrollHidden:true
}