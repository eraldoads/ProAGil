using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProAgil.Dominio;
using ProAgil.Dominio.Identity;

namespace ProAgil.Repositorio
{
    // public class ProAgilContext : IdentityDbContext

    // Com a criação do "Identity" e suas classes dentro do "../ProAgil.Dominio/Identity", onde agora será
    // realizado a criação de acesso e seus papeis do usuário para o sistema, a classe precisa ser alterada.
    // Quando é passado o IdentityDbContext<User, Role, int, 
    //                                      IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>,
    //                                      IdentityRoleClaim<int>, IdentityUserToken<int>>
    // automáticamente ele sabe que tem que criar as tabelas respectivas a autenticação e autorização 
    // inserindo também para essas tabelas as questões do User, Role e o relacionamento entre elas.
    public class ProAgilContext : IdentityDbContext<User, Role, int, 
                                                    IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>,
                                                    IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        // Cria o construtor.
        public ProAgilContext(DbContextOptions<ProAgilContext> options) : base(options) {}

        //Inicio
        // "Evento" é o Model.
        // Colocar todas as entidades e Criar os repositorios
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Palestrante> Palestrantes { get; set; }
        public DbSet<PalestranteEvento> PalestranteEventos { get; set; }
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<RedeSocial> RedeSociais { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder){
            // ↓ Temos que deixa mais explicito as criações das tabelas pelo EntityFrameWork.
            base.OnModelCreating(modelBuilder); // → passa o "modelBuuilder" para poder configura-lo.

            // ↓ Configurando o "modelBuilder" fazemos o relacionamento.
            modelBuilder.Entity<UserRole>(userRole => {
                // ↓ Relacionamento de 'N pra N'.
                userRole.HasKey(ur => new {ur.UserId, ur.RoleId});

                // ↓ Certificando que o Entity entenda o que queremos com os relacionamentos.
                userRole.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                userRole.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

            // ↓ Relacionamento de 'N pra N'.
            modelBuilder.Entity<PalestranteEvento>()
                .HasKey(PE => new { PE.EventoId, PE.PalestranteId });
        }
        // Fim
    }
}