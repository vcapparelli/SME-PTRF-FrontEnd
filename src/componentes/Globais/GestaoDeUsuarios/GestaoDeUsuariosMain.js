import React from "react";
import {useGruposAcesso} from "./hooks/useGruposAcesso";
import {GruposAcessoInfo} from "./GruposAcessoInfo";
import {ListaUsuarios} from "./ListaUsuarios";
import {useUsuarios} from "./hooks/useUsuarios";
import {BarraTopoLista} from "./BarraTopoLista";
import {FormFiltros} from "./FormFiltros";

export const GestaoDeUsuariosMain = () => {
    const { data: grupos } = useGruposAcesso();
    const { data: usuarios } = useUsuarios();
    return (
        <>
            <p>Faça a gestão dos seus usuários e determine seus perfis atrelando-os aos grupos de acesso.</p>
            <GruposAcessoInfo grupos={grupos}/>
            <BarraTopoLista/>
            <FormFiltros grupos={grupos}/>
            <ListaUsuarios usuarios={usuarios?.results}/>
        </>
    )
}