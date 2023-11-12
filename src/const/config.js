export default {
    backUrl : 'http://localhost:8080',
    getTokens : () =>{
        return localStorage.getItem("tokens");
    },
    saveTokens : (tokens) => {
        localStorage.setItem("tokens",tokens);
    }
}