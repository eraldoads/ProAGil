namespace ProAgil.API.Dtos
{
    // Classe utilizada para cadastro de um novo usuário.
    public class UserDto
    {
        // Criação dos campos que precise que o usuário forneça para a aplicação.
        // Criada esta classe para que não precise informar todos os campos 
        // que existe no User dentro do ..\ProAGil\ProAgil.Dominio\Identity.
        // Deve adcionar dentro do Helpers/AutoMapperProfiles.cs.
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
    }
}