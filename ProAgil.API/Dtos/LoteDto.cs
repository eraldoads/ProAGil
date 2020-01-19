using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class LoteDto
    {
        public int Id { get; set; }

        [Required]
        public string Nome { get; set; }

        [Required]
        public decimal Preco { get; set; }
        public string DataInicio { get; set; }
        public string DataFim { get; set; }

        [Range(2, 120000, ErrorMessage="A quantidade de pessoas tem que estar entre 2 e 120000")] // → DataAnnotations
        public int Quantidade { get; set; }
    }
}