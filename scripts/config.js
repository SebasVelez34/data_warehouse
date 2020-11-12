const API_URL = 'http://127.0.0.1:5000/api/v1';
const APP_URL = window.location.origin; 

const getToken = ()=>{
    return localStorage.getItem('dw-token') ?? false;
}