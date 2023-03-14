import React, {memo} from "react";
import BotaoAcertosLancamentosDevolucaoAoTesouro from "./BotaoAcertosLancamentosDevolucaoAoTesouro";
import "./BotoesDetalhesParaAcertosDeCategorias.scss"
import BotaoAcertosLancamentosEdicaoGasto from "./BotaoAcertosLancamentosEdicaoGasto";
import BotaoAcertosLancamentosEdicaoCredito from "./BotaoAcertosLancamentosEdicaoCredito";
import BotaoAcertosLancamentosExclusaoGasto from "./BotaoAcertosLancamentosExclusaoGasto";
import BotaoAcertosLancamentosExclusaoCredito from "./BotaoAcertosLancamentosExclusaoCredito";
import BotaoAcertosLancamentosConciliacaoGasto from "./BotaoAcertosLancamentosConciliacaoGasto";
import BotaoAcertosLancamentosDesconciliacaoGasto from "./BotaoAcertosLancamentosDesconciliacaoGasto";

const BotoesDetalhesParaAcertosDeCategorias = ({carregaAcertosLancamentos, conta, analise_lancamento, prestacaoDeContasUuid, prestacaoDeContas, tipo_transacao, analisePermiteEdicao}) => {

    return (
        <>
            <div className='row'>
                <div className='col-12 px-4 py-2 text-right container-botoes-ajustes'>
                    {analise_lancamento && analise_lancamento.requer_atualizacao_devolucao_ao_tesouro && tipo_transacao === "Gasto" &&
                        <BotaoAcertosLancamentosDevolucaoAoTesouro
                            analise_lancamento={analise_lancamento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                            tipo_transacao='Gasto'
                            analisePermiteEdicao={analisePermiteEdicao}
                        />
                    }
                    {analise_lancamento && analise_lancamento.requer_atualizacao_lancamento && tipo_transacao === "Gasto" &&
                        <BotaoAcertosLancamentosEdicaoGasto
                            analise_lancamento={analise_lancamento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                            tipo_transacao='Gasto'
                            analisePermiteEdicao={analisePermiteEdicao}
                        />
                    }
                    {analise_lancamento && analise_lancamento.requer_conciliacao_lancamento && tipo_transacao === "Gasto" && analise_lancamento.categoria === 'CONCILIACAO_LANCAMENTO' &&
                        <BotaoAcertosLancamentosConciliacaoGasto
                            analise_lancamento={analise_lancamento}
                            prestacaoDeContas={prestacaoDeContas}
                            analisePermiteEdicao={analisePermiteEdicao}
                            carregaAcertosLancamentos={carregaAcertosLancamentos}
                            conta={conta}
                        />
                    }
                    {analise_lancamento && analise_lancamento.requer_conciliacao_lancamento && tipo_transacao === "Gasto" && analise_lancamento.categoria === 'DESCONCILIACAO_LANCAMENTO' &&
                        <BotaoAcertosLancamentosDesconciliacaoGasto
                            analise_lancamento={analise_lancamento}
                            prestacaoDeContas={prestacaoDeContas}
                            analisePermiteEdicao={analisePermiteEdicao}
                            carregaAcertosLancamentos={carregaAcertosLancamentos}
                            conta={conta}
                        />
                    }
                    {analise_lancamento && analise_lancamento.requer_atualizacao_lancamento && tipo_transacao === "Crédito" &&
                        <BotaoAcertosLancamentosEdicaoCredito
                            analise_lancamento={analise_lancamento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                            tipo_transacao='Crédito'
                            analisePermiteEdicao={analisePermiteEdicao}
                        />
                    }
                    {analise_lancamento && analise_lancamento.requer_exclusao_lancamento && tipo_transacao === "Gasto" &&
                        <BotaoAcertosLancamentosExclusaoGasto
                            analise_lancamento={analise_lancamento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                            tipo_transacao='Gasto'
                            analisePermiteEdicao={analisePermiteEdicao}
                        />
                    }
                    {analise_lancamento && analise_lancamento.requer_exclusao_lancamento && tipo_transacao === "Crédito" &&
                        <BotaoAcertosLancamentosExclusaoCredito
                            analise_lancamento={analise_lancamento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                            tipo_transacao='Crédito'
                            analisePermiteEdicao={analisePermiteEdicao}
                        />
                    }
                </div>
            </div>
        </>
    )

}

export default memo(BotoesDetalhesParaAcertosDeCategorias)

