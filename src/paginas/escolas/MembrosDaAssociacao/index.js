import React from "react";
import {PaginasContainer} from "../../PaginasContainer";

// TODO Remover esse componente, nova versão abaixo
import {MembrosDaAssociacao} from "../../../componentes/escolas/Associacao/Membros";

// TODO Remover alias quando concluido
// Nova versão com mandatos e composições
import {MembrosDaAssociacao as NovoMembrosAssociacao} from '../../../componentes/escolas/MembrosDaAssociacao';

import {TopoComBotoes} from "../../../componentes/escolas/Associacao/TopoComBotoes";
import {visoesService} from "../../../services/visoes.service";


export const MembrosDaAssociacaoPage = () => {
    return (
        <PaginasContainer>
            <TopoComBotoes tituloPagina="Membros"/>
            <div className="page-content-inner">
                <>
                    {[['access_membros_da_associacao'], ['change_membros_da_associacao']].some(visoesService.getPermissoes) ? (
                            <NovoMembrosAssociacao/>
                        ) :
                        <MembrosDaAssociacao/>
                    }
                </>
            </div>
        </PaginasContainer>

    )
};