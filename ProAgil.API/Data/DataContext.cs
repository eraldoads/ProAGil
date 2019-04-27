using Microsoft.EntityFrameworkCore;
using ProAgil.API.Model;

namespace ProAgil.API.Data
{
    public class DataContext : DbContext
    {
        // Cria o contstrutor.
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        // Cria uma propriedade.
        // "Evento" é o Model.
        public DbSet<Evento> Eventos { get; set; }
    }
}