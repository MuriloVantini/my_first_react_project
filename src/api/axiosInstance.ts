import axios from "axios";

const myAxios = axios.create({
    baseURL: 'http://172.16.0.31:8000/api',
    headers: {
        //Definindo o cabeçalho Accept
        'Accept': 'application/json',

        //Enviando o corpo da requisição como JSON
        'Content-Type': 'application/json'
    },


});

export default myAxios