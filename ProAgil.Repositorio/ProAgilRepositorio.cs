using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Dominio;

namespace ProAgil.Repositorio
{
    // Classe que implementa a interface: iProAgilRepositorio.cs
    public class ProAgilRepositorio : IProAgilRepositorio
    {
        private readonly ProAgilContext _context;

        public ProAgilRepositorio(ProAgilContext context)
        {
            _context = context;
            // NoTracking serve para especificar que não quero travar o meu recurso para que ele seja retornado.
            // Toda vez que for uma mudança rastreável o ambiente de rastreamento (query) definimos que não queremos
            // que o ambiente seja rastreavel. Quando tiramos esse ratreio não travamos o recurso no EntityFramework.
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        // GERAIS.
        public void Add<T>(T entity) where T : class
        {
            // Pegar o contexto e passa a entidade.
            _context.Add(entity);
        }
        
        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<bool> SaveChangeAsync()
        {
            // Se ele for maior que 0 ele retorna verdadeiro.
            return (await _context.SaveChangesAsync()) > 0;
        }


        // EVENTO.
        // Task abre uma Thread.
        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrantes = false)
        {
            // Vai no banco de dados, através do query, e realiza as instruções.
            IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedeSociais);
            
            // No caso de existir o palestrante ele inclui no banco de dados.
            if (includePalestrantes)
            {
                query = query
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Palestrante);
            }

            // o método AsNoTracking serve para especificar que não quero travar o meu recurso para que ele seja retornado.
            query = query.AsNoTracking()
                         .OrderByDescending(c => c.DataEvento);

            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes = false)
        {
            // Vai no banco de dados, através do query, e realiza as instruções.
            IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedeSociais);
            
            // No caso de existir o palestrante ele inclui no banco de dados.
            if (includePalestrantes)
            {
                query = query
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Palestrante);
            }

            // o método AsNoTracking serve para especificar que não quero travar o meu recurso para que ele seja retornado.
            query = query.AsNoTracking()
                         .OrderByDescending(c => c.DataEvento)
                         .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }
        
        public async Task<Evento> GetAllEventoAsyncById(int eventoId, bool includePalestrantes = false)
        {
            // Vai no banco de dados, através do query, e realiza as instruções.
            IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedeSociais);
            
            // No caso de existir o palestrante ele inclui no banco de dados.
            if (includePalestrantes)
            {
                query = query
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Palestrante);
            }

            // o método AsNoTracking serve para especificar que não quero travar o meu recurso para que ele seja retornado.
            query = query.AsNoTracking()
                         .OrderByDescending(c => c.DataEvento)
                         .Where(c => c.Id == eventoId);

            return await query.FirstOrDefaultAsync();
        }

        // PALESTRANTE.
        public async Task<Palestrante> GetAllPalestranteAsync(int palestranteId, bool includeEventos = false)
        {
            // Vai no banco de dados, através do query, e realiza as instruções.
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(c => c.RedeSociais);
            
            // No caso de existir o evento ele inclui no banco de dados.
            if (includeEventos)
            {
                query = query
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(e => e.Evento);
            }

            // o método AsNoTracking serve para especificar que não quero travar o meu recurso para que ele seja retornado.
            query = query.AsNoTracking()
                         .OrderBy(p => p.Nome)
                         .Where(p => p.Id == palestranteId);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsyncByName(string nome, bool includeEventos = false)
        {
            // Vai no banco de dados, através do query, e realiza as instruções.
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(c => c.RedeSociais);
            
            // No caso de existir o evento ele inclui no banco de dados.
            if (includeEventos)
            {
                query = query
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(e => e.Evento);
            }

            // o método AsNoTracking serve para especificar que não quero travar o meu recurso para que ele seja retornado.
            query = query.AsNoTracking()
                         .Where(p => p.Nome.ToLower().Contains(nome.ToLower()));

            return await query.ToArrayAsync();
        }

    }
}