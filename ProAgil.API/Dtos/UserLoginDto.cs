namespace ProAgil.API.Dtos
{
    // Classe com as propriedades somente do login para se conectar ao sistema.
    public class UserLoginDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}