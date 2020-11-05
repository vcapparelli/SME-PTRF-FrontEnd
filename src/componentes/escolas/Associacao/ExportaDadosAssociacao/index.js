import React, {useState} from "react";
import "../associacao.scss"
import {exportarDadosAssociacao} from "../../../../services/escolas/Associacao.service";
import Loading from "../../../../utils/Loading";
import IconeExportarDados from "../../../../assets/img/icone-exportar-dados.svg";
import {visoesService} from "../../../../services/visoes.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faDownload} from "@fortawesome/free-solid-svg-icons";

export const ExportaDadosDaAsssociacao = () => {
    const [loading, setLoading] = useState(false);

    const exportarDados = async () => {
        setLoading(true);
        await exportarDadosAssociacao();
        setLoading(false);
    };

    return (
        <>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <button
                        disabled={!visoesService.getPermissoes(['change_associacao'])}
                        onClick={exportarDados}
                        className={`link-exportar ${!visoesService.getPermissoes(['change_associacao']) ? 'link-exportar-disabled' : ''}`}
                    >
                        <FontAwesomeIcon
                            style={{color: `${!visoesService.getPermissoes(['change_associacao']) ? '#7D7D7D' : '#00585E'}`, marginRight:'3px'}}
                            icon={faDownload}
                        />
                        <strong>Exportar</strong>
                    </button>
                </div>


            }
        </>
    );
};