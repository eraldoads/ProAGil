namespace ProAgil.Dominio
{
    public class RedeSocial
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string URL { get; set; }
        
        // Colocar o "?" indica que o valor pode ser nulo.
        public int? EventoId { get; set; }
        // Nesse elemento será feito somente o get, pois ele é readonly, nele não serão adicionadas informações.
        public Evento Evento { get; }
        public int? PalestranteId { get; set; }
        // Nesse elemento será feito somente o get, pois ele é readonly, nele não serão adicionadas informações.
        public Palestrante Palestrante { get; }
    }
}