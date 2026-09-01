export interface FiltrosPesquisaLote {
    instituicaoResp?: string;
    instituicao?: string;
    situacaoLote?: 'Todas' | 'Aberto' | 'Enviado' | 'Confirmado';
    idLoteDe?: number;
    idLoteAte?: number;
    valorLoteDe?: number;
    valorLoteAte?: number;
    dataEntradaDe?: Date;
    dataEntradaAte?: Date;
}