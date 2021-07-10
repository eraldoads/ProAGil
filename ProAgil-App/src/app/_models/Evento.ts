import { Lote } from './Lote';
import { RedeSocial } from './RedeSocial';
import { Palestrante } from './Palestrante';

// Inferface de refentencia para trabalhar com um tipo especifico.
// export interface Evento {
// ↓ Tranformar em um classe para que o 'eventoEdit.component.ts possa receber um sua variável
// as atribuições.
export class Evento {

  constructor() { }

  id: number;
  local: string;
  dataEvento: Date;
  tema: string;
  qtdPessoas: number;
  imagemURL: string;
  telefone: string;
  email: string;
  lotes: Lote[];
  redesSociais: RedeSocial[];
  palestrantesEventos: Palestrante[];
}
