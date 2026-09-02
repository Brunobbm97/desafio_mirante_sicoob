import { Lote } from '../models/lote';

export const LOTES_MOCK: Lote[] = [
  {
    idLote: 1,
    dataEntrada: new Date('2026-04-20T10:00:00'),
    valor: 5500.50,
    quantLancamentos: 3,
    usuarioRegistro: 'bruno_dev',
    usuarioAprovacao: 'gerente_01',
    situacaoLote: 'Confirmado',
    dataHoraSituacaoLote: new Date('2026-04-21T09:15:00'),
    lancamentos: []
  },
  {
    idLote: 2,
    dataEntrada: new Date('2026-04-26T00:00:00'),
    valor: 1000.00,
    quantLancamentos: 1,
    usuarioRegistro: 'gearqc0300_00',
    situacaoLote: 'Aberto',
    dataHoraSituacaoLote: new Date('2026-04-27T12:35:11'),
    lancamentos: []
  },
  {
    idLote: 3,
    dataEntrada: new Date('2026-05-02T14:30:00'),
    valor: 250.00,
    quantLancamentos: 1,
    usuarioRegistro: 'ana_paula',
    situacaoLote: 'Enviado',
    dataHoraSituacaoLote: new Date('2026-05-02T15:00:00'),
    lancamentos: []
  }
];