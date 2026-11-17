import axios from 'axios';
const api=axios.create({baseURL:'/api'});
export const login=(data)=>api.post('/auth/login',data);
export const register=(data)=>api.post('/auth/register',data);
export const get=(path)=>api.get(path);
export const post=(path,data)=>api.post(path,data);
export const put=(path,data)=>api.put(path,data);
export const del=(path)=>api.delete(path);
export default api;
