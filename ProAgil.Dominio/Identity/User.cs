using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace ProAgil.Dominio.Identity
{
    // ↓ Criação de uma classe de usuário que vai herdar de IdentityUser porque automáticamente o usuário (User)
    // será o mesmo usuário do "IdentyUser", com isso, podemo utilizar os campos que já existem dentro do
    // método 'public class IdentityUser<TKey> where TKey : IEquatable<TKey>' → exemplo o 'Email' e 'EmailConfirmed'
    // que já tem implementado dentro deste método.
    // Como o IdentityUserRole espera uma chave, indicamos que ele vai esperar uma chave do tipo "int".
    public class User : IdentityUser<int>
    {
        // ↓ Como não tem campo necessários vamos cria-los.
        // Especificando aqui um campo que será criado na tabela do banco de dados.
        [Column(TypeName = "nvarchar(150)")] // → DataAnnotations.
        public string Fullname { get; set; }
        // ↓ Relacionar as listas dos papeis dos usuários.
        public List<UserRole> UserRoles { get; set; }

        
    }
}