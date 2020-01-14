using System;

namespace ProAgil.Dominio
{
    public class Lote
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        
        // colocar o "?" indica que o valor pode ser nulo;
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public int Quantidade { get; set; }
        public int EventoId { get; set; }
        // Nesse elemento será feito somente o get, pois ele é readonly, nele não será adicionada informações.
        public Evento Evento { get; }

    }
}