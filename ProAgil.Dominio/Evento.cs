using System;
using System.Collections.Generic;

namespace ProAgil.Dominio
{
    public class Evento
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public DateTime DataEvento { get; private set; }
        public string Tema { get; set; }
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }

        // Quando colocamos uma lista quer dizer que a classe evento esta relacionada a outras classes (Lote, RedeSocial e PalestranteEvento)
        public List<Lote> Lotes { get; set; }
        public List<RedeSocial> RedeSociais { get; set; }
        public List<PalestranteEvento> PalestrantesEventos { get; set; }
    }
}