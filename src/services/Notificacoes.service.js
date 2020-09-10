import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getQuantidadeNaoLidas = async () =>{
    return (await api.get(`/api/notificacoes/quantidade-nao-lidos/`, authHeader)).data
};

export const getNotificacoes = async () =>{
    return (await api.get(`/api/notificacoes/`, authHeader)).data
};
