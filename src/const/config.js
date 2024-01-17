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
        character_link : "/api/v1/authority/back/link",
        character_drop : "/api/v1/authority/back/drop",
        authority : "/api/v1/authority/back/authority",
        human : "/api/v1/organization/back/human",
        depart : "/api/v1/organization/back/depart",
        section : "/api/v1/organization/back/section",
        organization_tree : "/api/v1/organization/back/tree",
        request:"/api/v1/workflow/back/request",
        workflow:"/api/v1/workflow/back/workflow",
        workflowNode:"/api/v1/workflow/back/workflowNode",
        workflowRoute:"/api/v1/workflow/back/workflowRoute",
        charts:"/api/v1/display/back/charts",
        search_list:"/api/v1/display/back/search",
        search_list_column:"/api/v1/display/back/column",
        menu:"/api/v1/menu/back/menu",
        login_config:"/api/v1/menu/back/loginConfig",
        page_config:"/api/v1/menu/back/pageConfig"
    },
    fronts:{
        module:'/api/v1/table/front/module',
        character: "/api/v1/authority/front/character",
        authority: "/api/v1/authority/front/authority",
        human:"/api/v1/organization/front/human",
        human_self:"/api/v1/organization/front/humanSelf",
        depart:"/api/v1/organization/front/depart",
        section:"/api/v1/organization/front/section",
        content:"/api/v1/content/front/content",
        file:"/api/v1/content/front/file",
        file_form:"/api/v1/table/front/file",
        upload:"/api/v1/content/front/upload",
        form:"/api/v1/table/front/form",
        formAuthority:"/api/v1/table/front/authoriy",
        organization_tree : "/api/v1/organization/front/tree",
        request:"/api/v1/workflow/front/request",
        workflow:"/api/v1/workflow/front/workflow",
        search_dto:"/api/v1/display/front/search",
        menu:"/api/v1/menu/front/menu",
        page_config:"/api/v1/menu/front/pageConfig/onUse"
    },
    token:{
        token:"/api/v1/token",
        check:"/api/v1/token/check",
        login_config:"/api/v1/token/loginConfig/onUse",
    },
    setScrollView:()=>{
        window.sessionStorage.setItem("scroll","0")
    },
    getScrollHideStatus:()=>{
        return window.sessionStorage.getItem("scroll") === "0"
    },
    toBrowser:{
        toBrowser:true
    }
}