using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace ProAgil.Dominio.Identity
{
    // ↓ Criação da classe que defini os papeis que um usuário pode ter dentro do sistema.
    // Herda de IdentityRole pois dentro dele já existe todos os campos que precisamos.
    // Como o IdentityUserRole espera uma chave, indicamos que ele vai esperar uma chave do tipo "int".
    public class Role : IdentityRole<int>
    {
        // ↓ Relacionar as listas dos papeis dos usuários.
        public List<UserRole> UserRoles { get; set; }
    }
}