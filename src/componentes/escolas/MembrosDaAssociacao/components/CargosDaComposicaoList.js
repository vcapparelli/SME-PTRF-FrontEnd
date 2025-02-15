import React from "react";
import {useGetCargosDaComposicao} from "../hooks/useGetCargosDaComposicao";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

export const CargosDaComposicaoList = () => {
    const {isLoading, data} = useGetCargosDaComposicao()

    const acoesTemplate = (rowData) => {
        return (
            <div>
                <button className="btn-editar-membro">
                    <span data-tip="Editar membro" data-html={true}>
                        <FontAwesomeIcon
                            style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                            icon={faEdit}
                        />
                        <ReactTooltip/>
                    </span>
                </button>
            </div>
        )
    };

    return(
        <>
            {!isLoading && data && data.diretoria_executiva &&
                <div className="pt-0 pr-2 pl-2 pb-2">
                    <p><strong>Diretoria executiva</strong></p>
                    <DataTable
                        value={data.diretoria_executiva}
                        className='tabela-lista-usuarios'
                    >
                        <Column
                            field="cargo_associacao_label"
                            header="Cargo"
                        />
                        <Column
                            field="ocupante_do_cargo.nome"
                            header="Nome"
                        />
                        <Column
                            field="ocupante_do_cargo.representacao_label"
                            header="Nome"
                        />
                        <Column
                            field="acao"
                            header="Ação"
                            style={{width:'100px'}}
                            body={acoesTemplate}
                        />
                    </DataTable>
                </div>
            }

            {data && data.conselho_fiscal &&

                <div className="p-2 mt-3">
                    <p><strong>Conselho Fiscal</strong></p>
                    <DataTable
                        value={data.conselho_fiscal}
                        className='tabela-lista-usuarios'
                    >
                        <Column
                            field="cargo_associacao_label"
                            header="Cargo"
                        />
                        <Column
                            field="ocupante_do_cargo.nome"
                            header="Nome"
                        />
                        <Column
                            field="ocupante_do_cargo.representacao_label"
                            header="Nome"
                        />
                        <Column
                            field="acao"
                            header="Ação"
                            style={{width:'100px'}}
                            body={acoesTemplate}
                        />
                    </DataTable>
                </div>
            }

        </>
    )
}