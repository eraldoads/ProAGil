using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Dominio;
using ProAgil.Repositorio;

namespace ProAgil.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // Herda de ControllerBase, ou seja, pode trabalhar com tudo relacionado a HTTP.
    public class EventoController : ControllerBase
    {
        // PROPRIEDADE.
        private readonly IProAgilRepositorio _repo;

        // CONSTRUTOR.
        // Injeta por meio de uma interface o repositório (repo). Isso é a dependency injection (injeção de dependência).
        public EventoController(IProAgilRepositorio repo)
        {
            _repo = repo;
        }

        // GET
        [HttpGet]
        public async Task<IActionResult> Get ()
        {
            try
            {
                // Chamada ASSINCRONA.
                // Retorna todos os eventos.
                var results = await _repo.GetAllEventoAsync(true);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            
        }

        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get (int EventoId)
        {
            try
            {
                // Chamada ASSINCRONA.
                // Retorna todos os eventos.
                var results = await _repo.GetAllEventoAsyncById(EventoId, true);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            
        }

        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get (string tema)
        {
            try
            {
                // Chamada ASSINCRONA.
                // Retorna todos os eventos.
                var results = await _repo.GetAllEventoAsyncByTema(tema, true);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            
        }

        // POST
        [HttpPost]
        public async Task<IActionResult> Post (Evento model)
        {
            try
            {
                // Na adição do model ele não precisa ser assincrono.
                // Aqui ele muda um estado do EntityFramework.
                _repo.Add(model);
                
                // Na hora de salvar ele precisa ser assincrono (await).
                // Aqui ele salva toda a mudança de estado.
                if (await _repo.SaveChangeAsync())
                {
                    // Aqui utilizamos o status code 201 que foi salvo com sucesso.
                    return Created($"/api/evento/{model.Id}", model);
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

            // Caso não tenha dado certo o SaveChangeAsync retorna a mensagem de erro BadRequest.
            return BadRequest();
            
        }

        // PUT
        [HttpPut("{EventoID}")]
        public async Task<IActionResult> Put (int EventoId, Evento model)
        {
            try
            {
                // Verifica se encontra algum elemento.
                // Aqui eliminamos que seja feito algum Join no banco de dados com Eventos com Palestrantes
                // procuramos saber somente se o evento foi encontrado.
                var evento = await _repo.GetAllEventoAsyncById(EventoId, false);
                // Se não foi encontrado elemento não é atualizado.
                if (evento == null) return NotFound();

                // Caso encontre o elemento segue o código ↓

                // Na atualização do model ele não precisa ser assincrono.
                // Aqui ele muda um estado do EntityFramework.
                _repo.Update(model);

                // Na hora de salvar ele precisa ser assincrono (await).
                // Aqui ele salva toda a mudança de estado.
                if (await _repo.SaveChangeAsync())
                {
                    // Aqui utilizamos o status code 201 que foi salvo com sucesso.
                    return Created($"/api/evento/{model.Id}", model);
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

            // Caso não tenha dado certo o SaveChangeAsync retorna a mensagem de erro BadRequest.
            return BadRequest();
            
        }

        // Delete
        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete (int EventoId)
        {
            try
            {
                // Verifica se encontra algum elemento.
                // Aqui eliminamos que seja feito algum Join no banco de dados com Eventos com Palestrantes
                // procuramos saber somente se o evento foi encontrado.
                var evento = await _repo.GetAllEventoAsyncById(EventoId, false);
                // Se não foi encontrado elemento não é excludido.
                if (evento == null) return NotFound();

                // Caso encontre o elemento segue o código ↓

                // Na exclusão do model ele não precisa ser assincrono.
                // Aqui ele muda um estado do EntityFramework.
                _repo.Delete(evento);
                
                // Na hora de salvar ele precisa ser assincrono (await).
                // Aqui ele salva toda a mudança de estado.
                if (await _repo.SaveChangeAsync())
                {
                    // Aqui utilizamos o status code 201 que foi salvo com sucesso.
                    return Ok();
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

            // Caso não tenha dado certo o SaveChangeAsync retorna a mensagem de erro BadRequest.
            return BadRequest();
            
        }
    }
}