import { Lancamento } from './lancamento';

export interface Lote {
    idLote: number;
    dataEntrada: Date;
    valor: number;
    quantLancamentos: number;
    usuarioRegistro: string;
    usuarioAprovacao?: string;
    situacaoLote: 'Aberto' | 'Enviado' | 'Confirmado';
    dataHoraSituacaoLote: Date;
    lancamentos?: Lancamento[];
}