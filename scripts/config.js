const API_URL = 'http://127.0.0.1:5000/api/v1';
const APP_URL = window.location.origin; 
let headers;

const getToken = ()=>{
    return localStorage.getItem('dw-token') ?? false;
}

const isLogged = () => {
    const isLogged = getToken();
    if (!isLogged) {
        window.open(`${APP_URL}/login.html`, "_self");
    }else{
        const role = localStorage.getItem('role');
        const logout = document.querySelector('#logout');
        headers = {
            'Authorization': `Bearer ${isLogged}`
        };
        if(role === 'false'){
            document.querySelector('#userPage').remove();
        }
        logout.onclick = () => {
            localStorage.removeItem('dw-token');
            localStorage.removeItem('role');
            window.open(`${APP_URL}/login.html`,'_self');
        }
    }
}