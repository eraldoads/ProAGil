using System.Threading.Tasks;
using ProAgil.Dominio;

namespace ProAgil.Repositorio
{
    public interface IProAgilRepositorio
    {
         // Criar os métodos que a interface vai possuir. Qualquer entidade que for criadas ela terá que ADD, UPDATE e DELETE.
         // GERAL
         void Add<T>(T entity) where T : class;
         void Update<T>(T entity) where T : class;
         void Delete<T>(T entity) where T : class;

         Task<bool> SaveChangeAsync();

         // EVENTOS
         // Para listar em caso de busca.
         Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes);
         Task<Evento[]> GetAllEventoAsync(bool includePalestrantes);
         // Não tem o [] porque não vai retornar uma lista vai retornar somente um registro.
         Task<Evento> GetAllEventoAsyncById(int eventoId, bool includePalestrantes);

         // PALESTRANTE
         Task<Palestrante[]> GetAllPalestrantesAsyncByName(string nome, bool includeEventos);
         Task<Palestrante> GetAllPalestranteAsync(int palestranteId, bool includeEventos);
    }
}