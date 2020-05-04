import React from "react";

export const TopoComBotoes = () => {
    return (
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='detalhe-das-prestacoes-titulo'>Demonstrativo financeiro da conta cheque</p>
            </div>

            <div className='col-12 col-md-7 text-right'>
                <button type="button" className="btn btn-outline-success mr-2 mt-2">Cadastrar despesa</button>
                <button type="button" className="btn btn-outline-success mr-2 mt-2">Cancelar</button>
                <button type="button" className="btn btn-outline-success mt-2">Salvar</button>
                <button disabled="" type="button" className="btn btn-success btn-readonly ml-2 mt-2">Concluir a conciliação</button>
            </div>
        </div>
    );
}