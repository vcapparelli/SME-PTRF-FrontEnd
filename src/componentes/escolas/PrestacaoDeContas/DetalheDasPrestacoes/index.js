import React, {useCallback, useEffect, useState} from "react";
import {TopoComBotoes} from "./TopoComBotoes";
import {SelectAcaoLancamento} from "./SelectAcaoLancamento";
import {TabelaDeLancamentosDespesas} from "./TabelaDeLancamentosDespesas";
import {TabelaDeLancamentosReceitas} from "./TabelaDeLancamentosReceitas";
import TabelaValoresPendentesPorAcao from "./TabelaValoresPendentesPorAcao";
import {Justificativa} from "./Justivicativa";
import {getTabelasReceita} from "../../../../services/escolas/Receitas.service";
import {
    getDespesasPrestacaoDeContas,
    getReceitasPrestacaoDeContas,
    getConciliarReceita,
    getDesconciliarReceita,
    getConciliarDespesa,
    getDesconciliarDespesa,
    getSalvarPrestacaoDeConta,
    getObservacoes,
    getStatusPeriodoPorData
} from "../../../../services/escolas/PrestacaoDeContas.service";
import {getContas, getPeriodosDePrestacaoDeContasDaAssociacao} from "../../../../services/escolas/Associacao.service";
import Loading from "../../../../utils/Loading";
import {SelectPeriodoConta} from "../SelectPeriodoConta";
import {MsgImgCentralizada} from "../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../assets/img/img-404.svg";
import {ModalConfirmaSalvar} from "../../../../utils/Modais";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import {tabelaValoresPendentes} from "../../../../services/escolas/TabelaValoresPendentesPorAcao.service";
import DataSaldoBancario from "./DataSaldoBancario";

export const DetalheDasPrestacoes = () => {

    // Alteracoes
    const [loading, setLoading] = useState(true);
    const [showSalvar, setShowSalvar] = useState(false);
    const [periodoConta, setPeriodoConta] = useState("");
    const [periodoFechado, setPeriodoFechado] = useState(true);
    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [contaConciliacao, setContaConciliacao] = useState("");
    const [acaoLancamento, setAcaoLancamento] = useState("");
    const [acoesAssociacao, setAcoesAssociacao] = useState(false);

    const [receitasNaoConferidas, setReceitasNaoConferidas] = useState([]);
    const [receitasConferidas, setReceitasConferidas] = useState([]);
    const [checkboxReceitas, setCheckboxReceitas] = useState(false);

    const [despesasNaoConferidas, setDespesasNaoConferidas] = useState([]);
    const [despesasConferidas, setDespesasConferidas] = useState([]);
    const [checkboxDespesas, setCheckboxDespesas] = useState(false);

    const [observacoes, setObservacoes] = useState([]);
    const [textareaJustificativa, setTextareaJustificativa] = useState("");

    useEffect(()=>{
        getPeriodoConta();
        getAcaoLancamento();
        carregaTabelas();
        carregaPeriodos();
    }, []);

    useEffect(() => {
        localStorage.setItem('periodoConta', JSON.stringify(periodoConta));
        carregaContas();
    }, [periodoConta]);

    useEffect(()=>{
        carregaObservacoes();
    }, [periodoConta, acoesAssociacao, acaoLancamento]);

    useEffect(() => {

        localStorage.setItem('acaoLancamento', JSON.stringify(acaoLancamento));

        if (acaoLancamento.acao && acaoLancamento.lancamento) {
            setReceitasConferidas([]);
            setReceitasNaoConferidas([]);

            if (acaoLancamento.lancamento === 'receitas-lancadas') {
                setDespesasNaoConferidas([]);
                setDespesasConferidas([]);
                getReceitasNaoConferidas();
                getReceitasConferidas();
            } else if (acaoLancamento.lancamento === 'despesas-lancadas') {
                setReceitasNaoConferidas([]);
                setReceitasConferidas([]);
                getDespesasNaoConferidas();
                getDespesasConferidas();
            }
        } else {
            setReceitasNaoConferidas([]);
            setReceitasConferidas([]);
            setDespesasNaoConferidas([]);
            setDespesasConferidas([]);
        }
    }, [acaoLancamento, periodoConta, acoesAssociacao]);

    useEffect(()=>{
        setLoading(false)
    }, []);

    useEffect(
        () => {
            verificaSePeriodoEstaAberto(periodoConta.periodo)
        }, [periodoConta, periodosAssociacao]
    );

    const getPeriodoConta = () => {
        if (localStorage.getItem('periodoConta')) {
            const periodoConta = JSON.parse(localStorage.getItem('periodoConta'));
            setPeriodoConta(periodoConta)
        } else {
            setPeriodoConta({periodo: "", conta: ""})
        }
    };

    const getAcaoLancamento = () => {
        let acao_lancamento = JSON.parse(localStorage.getItem('acaoLancamento'));
        if (acao_lancamento) {
            const files = JSON.parse(localStorage.getItem('acaoLancamento'));
            setAcaoLancamento(files);
        } else {
            setAcaoLancamento({acao: "", lancamento: ""})
        }
    };

    const carregaTabelas = async () => {
        await getTabelasReceita().then(response => {
            setContasAssociacao(response.data.contas_associacao);
            setAcoesAssociacao(response.data.acoes_associacao);
        }).catch(error => {
            console.log(error);
        });
    };

    const carregaPeriodos = async () => {
        let periodos = await getPeriodosDePrestacaoDeContasDaAssociacao();
        setPeriodosAssociacao(periodos);
    };

    const carregaContas = async () => {
        await getContas().then(response => {
            const files = JSON.parse(localStorage.getItem('periodoConta'));
            if (files && files.conta !== "") {
                const conta = response.find(conta => conta.uuid === files.conta);
                setContaConciliacao(conta.tipo_conta.nome);
            }
        }).catch(error => {
            console.log(error);
        })
    };

    const checaCondicoes = () =>{
        let periodo_e_conta = JSON.parse(localStorage.getItem('periodoConta'));
        return !!(periodo_e_conta && periodo_e_conta.periodo && periodo_e_conta.conta);
    };

    const getReceitasNaoConferidas = async () => {
        setLoading(true);
        if (checaCondicoes()){
            const naoConferidas = await getReceitasPrestacaoDeContas(periodoConta.periodo, periodoConta.conta, acaoLancamento.acao,"False");
            setReceitasNaoConferidas(naoConferidas);
        }
        setLoading(false);
    };

    const getReceitasConferidas = async () => {
        setLoading(true);
        if (checaCondicoes()) {
            const conferidas = await getReceitasPrestacaoDeContas(periodoConta.periodo, periodoConta.conta, acaoLancamento.acao, "True");
            setReceitasConferidas(conferidas);
        }
        setLoading(false);
    };

    const getDespesasNaoConferidas = async () => {
        setLoading(true);
        if (checaCondicoes()) {
            const naoConferidas = await getDespesasPrestacaoDeContas(periodoConta.periodo, periodoConta.conta, acaoLancamento.acao, "False");
            setDespesasNaoConferidas(naoConferidas);
        }
        setLoading(false);
    };

    const getDespesasConferidas = async () => {
        setLoading(true);
        if (checaCondicoes()) {
            const conferidas = await getDespesasPrestacaoDeContas(periodoConta.periodo, periodoConta.conta, acaoLancamento.acao, "True");
            setDespesasConferidas(conferidas);
        }
        setLoading(false);
    };

    const conciliarReceitas = async (receita_uuid) => {
        await getConciliarReceita(receita_uuid, periodoConta.periodo)
    };

    const desconciliarReceitas = async (receita_uuid) => {
        await getDesconciliarReceita(receita_uuid, periodoConta.periodo);
    };

    const handleChangeCheckboxReceitas = async (event, receita_uuid) => {
        setCheckboxReceitas(event.target.checked);
        if (event.target.checked) {
            await conciliarReceitas(receita_uuid);
        } else if (!event.target.checked) {
            await desconciliarReceitas(receita_uuid)
        }
        await getReceitasNaoConferidas();
        await getReceitasConferidas();
    };

    const conciliarDespesas = async (rateio_uuid) => {
        await getConciliarDespesa(rateio_uuid, periodoConta.periodo);
    };

    const desconciliarDespesas = async (rateio_uuid) => {
        await getDesconciliarDespesa(rateio_uuid, periodoConta.periodo);
    };

    const handleChangeCheckboxDespesas = async (event, rateio_uuid) => {
        setCheckboxDespesas(event.target.checked);
        if (event.target.checked) {
            await conciliarDespesas(rateio_uuid);
        } else if (!event.target.checked) {
            await desconciliarDespesas(rateio_uuid)
        }
        await getDespesasNaoConferidas();
        await getDespesasConferidas();
    };

    const handleChangePeriodoConta = (name, value) => {
        setPeriodoConta({
            ...periodoConta,
            [name]: value
        });
    };

    const handleChangeSelectAcoes = (name, value) => {
        setAcaoLancamento({
            ...acaoLancamento,
            [name]: value
        });

        if (name === 'acao' && value !== '') {
            if (observacoes && observacoes.length > 0){
                const obs = observacoes.find((acao) => acao.acao_associacao_uuid === value);
                if (obs && obs.observacao){
                    setTextareaJustificativa(obs.observacao);
                }else {
                    setTextareaJustificativa('');
                }
            }


        } else if(name === 'acao') {
            setTextareaJustificativa('');
        }
    };

    const handleChangeTextareaJustificativa = (event) => {
        const obs = observacoes.map((acao) => (
            {
                ...acao,
                observacao: acao.acao_associacao_uuid === acaoLancamento.acao ? event.target.value : acao.observacao
            }
        ));
        setObservacoes(obs);
        setTextareaJustificativa(event.target.value);
    };

    const carregaObservacoes = async () => {

        if (acoesAssociacao && periodoConta.periodo !== undefined && periodoConta.periodo !== "" && periodoConta.conta !== undefined && periodoConta.conta !== "") {
            let acoes = acoesAssociacao;
            let periodo_uuid = periodoConta.periodo;
            let conta_uuid = periodoConta.conta;

            await getObservacoes(periodo_uuid, conta_uuid).then(response => {
                let observs = acoes.map((acao) => (
                    {
                        acao_associacao_uuid: acao.uuid,
                        observacao: ''
                    }
                ));

                if (response) {
                    observs = observs.map((obs) => {
                        let obs_resp = response.find((acao) => acao.acao_associacao_uuid === obs.acao_associacao_uuid);

                        return {
                            ...obs,
                            observacao: obs_resp !== undefined ? obs_resp.observacao : obs.observacao
                        }
                    });

                    const files = JSON.parse(localStorage.getItem('acaoLancamento'));
                    if (files.acao !== "") {
                        const observacao = observs.find((acao) => acao.acao_associacao_uuid === files.acao);
                        setTextareaJustificativa(observacao.observacao);
                    }
                }
                setObservacoes(observs);

            }).catch(error => {
                console.log(error);
            });
        }
    };

    const onSalvarTrue = async () => {

        let payload = {
            "periodo_uuid": periodoConta.periodo,
            "conta_associacao_uuid": periodoConta.conta,
            "observacoes": observacoes
        };

        try {
           await getSalvarPrestacaoDeConta(periodoConta.periodo, periodoConta.conta, payload);
            setShowSalvar(true)
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    };

    const onHandleClose = () => {
        setShowSalvar(false);
    };

    const dataTip = (notificar_dias_nao_conferido) => {
        let meses = Math.trunc(notificar_dias_nao_conferido/30)
        let msg = (notificar_dias_nao_conferido <= 59) ? `1 mês.` : `${meses} meses.` 

        return `Não demonstrado por ${msg}`;
    };

    const verificaSePeriodoEstaAberto = async (periodoUuid) => {
        if (periodosAssociacao) {
            const periodo = periodosAssociacao.find(o => o.uuid === periodoUuid);
            if (periodo) {
                const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID)
                await getStatusPeriodoPorData(associacaoUuid, periodo.data_inicio_realizacao_despesas).then(response => {
                    const periodoBloqueado = response.prestacao_contas_status ? response.prestacao_contas_status.periodo_bloqueado : true
                    setPeriodoFechado(periodoBloqueado)
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };

    // Tabela ValoresPendentes por Ação
    const [valoresPendentes, setValoresPendentes] = useState({});

    const carregaValoresPendentes = useCallback(async ()=>{
        let valores_pendentes = await tabelaValoresPendentes(periodoConta.periodo, periodoConta.conta);
        setValoresPendentes(valores_pendentes)
    }, [periodoConta.periodo, periodoConta.conta]);

    useEffect(()=>{
        if (periodoConta.periodo && periodoConta.conta){
            carregaValoresPendentes()
        }

    }, [periodoConta.periodo, periodoConta.conta, carregaValoresPendentes]);

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    // Data Saldo Bancário
    const [dataSaldoBancario, setDataSaldoBancario]= useState([])

    const handleChangaDataSaldo = useCallback((name, value) => {
        setDataSaldoBancario({
            ...dataSaldoBancario,
            [name]: value
        });
    }, [dataSaldoBancario]);

    return (
        <div className="detalhe-das-prestacoes-container mb-5 mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="detalhe-das-prestacoes-texto-cabecalho mb-4">
                        <h1 className="mt-4">Conciliação Bancária</h1>
                    </div>
                </div>
            </div>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :

                <>
                    <SelectPeriodoConta
                        periodoConta={periodoConta}
                        handleChangePeriodoConta={handleChangePeriodoConta}
                        periodosAssociacao={periodosAssociacao}
                        contasAssociacao={contasAssociacao}
                    />

                    {periodoConta.periodo && periodoConta.conta ? (
                        <>
                            <TopoComBotoes
                                setShowSalvar={setShowSalvar}
                                showSalvar={!periodoFechado}
                                onSalvarTrue={onSalvarTrue}
                                onHandleClose={onHandleClose}
                                contaConciliacao={contaConciliacao}
                            />

                            <TabelaValoresPendentesPorAcao
                                valoresPendentes={valoresPendentes}
                                valorTemplate={valorTemplate}
                            />

                            <DataSaldoBancario
                                valoresPendentes={valoresPendentes}
                                dataSaldoBancario={dataSaldoBancario}
                                handleChangaDataSaldo={handleChangaDataSaldo}
                            />

                            <SelectAcaoLancamento
                                acaoLancamento={acaoLancamento}
                                handleChangeSelectAcoes={handleChangeSelectAcoes}
                                acoesAssociacao={acoesAssociacao}
                            />

                            {!receitasNaoConferidas.length > 0 && !receitasConferidas.length > 0 && acaoLancamento.lancamento === "receitas-lancadas" &&
                                <p className="mt-5"><strong>Não existem lançamentos conciliados/não conciliados...</strong></p>
                            }

                            {receitasNaoConferidas && receitasNaoConferidas.length > 0 && (
                                <TabelaDeLancamentosReceitas
                                    conciliados={false}
                                    receitas={receitasNaoConferidas}
                                    checkboxReceitas={checkboxReceitas}
                                    handleChangeCheckboxReceitas={handleChangeCheckboxReceitas}
                                    dataTip={dataTip}
                                    periodoFechado={periodoFechado}
                                />
                            )}

                            {receitasConferidas && receitasConferidas.length > 0 && (
                                <TabelaDeLancamentosReceitas
                                    conciliados={true}
                                    receitas={receitasConferidas}
                                    checkboxReceitas={checkboxReceitas}
                                    handleChangeCheckboxReceitas={handleChangeCheckboxReceitas}
                                    dataTip={dataTip}
                                    periodoFechado={periodoFechado}
                                />
                            )}

                            {!despesasNaoConferidas.length > 0 && !despesasConferidas.length > 0 && acaoLancamento.lancamento === "despesas-lancadas" &&
                                <p className="mt-5"><strong>Não existem lançamentos conciliados/não conciliados...</strong></p>
                            }

                            {despesasNaoConferidas && despesasNaoConferidas.length > 0 &&
                            <TabelaDeLancamentosDespesas
                                conciliados={false}
                                despesas={despesasNaoConferidas}
                                checkboxDespesas={checkboxDespesas}
                                handleChangeCheckboxDespesas={handleChangeCheckboxDespesas}
                                dataTip={dataTip}
                                periodoFechado={periodoFechado}
                            />
                            }

                            {despesasConferidas && despesasConferidas.length > 0 &&
                            <TabelaDeLancamentosDespesas
                                conciliados={true}
                                despesas={despesasConferidas}
                                checkboxDespesas={checkboxDespesas}
                                handleChangeCheckboxDespesas={handleChangeCheckboxDespesas}
                                dataTip={dataTip}
                                periodoFechado={periodoFechado}
                            />
                            }

                            <Justificativa
                                textareaJustificativa={textareaJustificativa}
                                handleChangeTextareaJustificativa={handleChangeTextareaJustificativa}
                                periodoFechado={periodoFechado}
                            />
                        </>
                    ):
                        <MsgImgCentralizada
                            texto='Selecione um período e uma conta acima para visualizar os demonstrativos'
                            img={Img404}
                        />
                    }
                    <section>
                        <ModalConfirmaSalvar
                            show={showSalvar}
                            handleClose={()=>setShowSalvar(false)}
                            titulo="Salvar informações"
                            texto="Informações da conciliação bancária salvas com sucesso"
                            primeiroBotaoCss="success"
                            primeiroBotaoTexto="Fechar"
                        />
                    </section>
                </>
            }
        </div>
    )
};