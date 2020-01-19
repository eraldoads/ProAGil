using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class RedeSocialDto
    {
        public int Id { get; set; }
        
        [Required (ErrorMessage="O campo {0} é obrigatótio")] // → DataAnnotations
        public string Nome { get; set; }
        [Required (ErrorMessage="O campo {0} é obrigatótio")] // → DataAnnotations
        public string URL { get; set; }
    }
}