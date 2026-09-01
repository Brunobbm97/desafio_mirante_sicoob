export interface Lancamento {
    id?: number;
    contaCorrente: string;
    nomeTitular?: string;
    valor: number;
    historico: string;
    estorno: boolean;
    documento: string;
    descricao?: string;
    situacao: string;
    pa: string;
}