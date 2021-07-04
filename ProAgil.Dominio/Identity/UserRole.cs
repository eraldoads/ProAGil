using Microsoft.AspNetCore.Identity;

namespace ProAgil.Dominio.Identity
{
    // ↓ Classe criada para relacionamento entre usuários e seus papéis, que pode ter certos papeis 
    // dentro do sistema, como administrador, membro, editor...
    // Herda de IdentityUserRole pois dentro dele existem todos os campos que vamos precisar.
    // Como o IdentityUserRole espera uma chave, indicamos que ele vai esperar uma chave do tipo "int".
    public class UserRole : IdentityUserRole<int>
    {
        public User User { get; set; }
        public Role Role { get; set; }
        
    }
}