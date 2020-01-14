import { Lote } from './Lote';
import { RedeSocial } from './RedeSocial';
import { Palestrante } from './Palestrante';

// Inferface de refentencia para trabalhar com um tipo especifico.
export interface Evento {
  id: number;
  local: string;
  dataEvento: Date;
  tema: string;
  qtdPessoas: number;
  imagemURL: string;
  telefone: string;
  email: string;
  lotes: Lote[];
  redeSociais: RedeSocial[];
  palestrantesEventos: Palestrante[];
}
