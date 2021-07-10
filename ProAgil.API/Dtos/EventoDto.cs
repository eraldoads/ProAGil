using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required (ErrorMessage="Campo obrigatório")]
        [StringLength (100, MinimumLength=3, ErrorMessage="Local é entre 3 e 100 caracteres")]
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required (ErrorMessage="O Tema deve ser preenchido")] // → DataAnnotations
        public string Tema { get; set; }

        [Range(2, 120000, ErrorMessage="A quantidade de pessoas tem que estar entre 2 e 120000")] // → DataAnnotations
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }

        [Phone] // → DataAnnotations
        public string Telefone { get; set; }
        
        [EmailAddress (ErrorMessage="Email invalido")] // → DataAnnotations
        public string Email { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}