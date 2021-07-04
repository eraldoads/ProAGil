using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.API.Dtos;
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
        private readonly IMapper _mapper;

        // CONSTRUTOR.
        // Injeta por meio de uma interface o repositório (repo). Isso é a dependency injection (injeção de dependência).
        // Deve fazer a referencia ao AutoMapper (IMapper) devido a utilização das DTOs.
        public EventoController(IProAgilRepositorio repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // GET
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                // Chamada ASSINCRONA.
                // Retorna todos os eventos.
                var eventos = await _repo.GetAllEventoAsync(true);

                // Resultado do mapeamento.
                // var results = _mapper.Map<IEnumerable<EventoDto>>(eventos); // → por estar retornando, o eventos, uma lista de arrays é necessário acrescentar o IEnumerable<EventoDto>.
                // ou ↓
                var results = _mapper.Map<EventoDto[]>(eventos);

                return Ok(results);
            }
            catch (System.Exception ex )
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou {ex.Message}");
            }

        }

        // Post
        // Aqui fará o Upload da imagem.
        [HttpPost("upload")]
        // public async Task<IActionResult> upload()
        // ↓ Tornar método assincrono.
        public IActionResult upload()
        {
            try
            {
                // ↓ Aqui escrevemos o código para realizar o upload da imagem.
                // Todo o aquivo vem como um array, e aqui pegaremos a 1ª posição.
                var file = Request.Form.Files[0];
                // ↓ Configurar um novo diretório. Foi criada a pasta "Resources" e "Imagens" dentro de /ProAgil.API
                // e arrastadas as imagens para dentro do dirtório que ficou: ../ProAgil.API/Resources/Images.
                var folderName = Path.Combine("Resources", "Images"); // Faz a combinação de duas strings em um caminho.
                // ↓ Caminho onde se quer salvar.
                // Directory.GetCurrentDirectory() → é o diretório atual da aplicação.
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                // ↓ Condição que verifica:
                if (file.Length > 0) // Se o Array dele for maio que zero.
                {
                    // Monta e converte o nome dele.
                    var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                    // Monta a URL onde será salvo especificamente.
                    // Retira do nome do arquivo caso ele tenha aspas dulas (") e espaços.
                    var fullPath = Path.Combine(pathToSave, filename.Replace("\"", " ").Trim());

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        // ↓ Realiza uma copia para o Stream.
                        file.CopyTo(stream);
                    }
                }

                return Ok();
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou {ex.Message}");
            }

            // return BadRequest("Erro ao tentar realizar upload.");

        }

        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
            try
            {
                // Chamada ASSINCRONA.
                // Retorna todos os eventos.
                var evento = await _repo.GetAllEventoAsyncById(EventoId, true);
                //var evento = await _repo.GetEventoAsyncById(EventoId, true);

                var results = _mapper.Map<EventoDto>(evento); // → Aqui ele retorna somente um evento, não precisa do IEnumerable<>.

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

        }

        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try
            {
                // Chamada ASSINCRONA.
                // Retorna todos os eventos.
                var eventos = await _repo.GetAllEventoAsyncByTema(tema, true);

                var results = _mapper.Map<EventoDto[]>(eventos);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

        }

        // POST
        [HttpPost]
        // public async Task<IActionResult> Post(Evento model)
        // Após a criação dos DTOs alteramos para receber o EventoDto.
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                // Quando receber o model 
                var evento = _mapper.Map<Evento>(model);

                // Na adição do model ele não precisa ser assincrono.
                // Aqui ele muda um estado do EntityFramework.
                //_repo.Add(model);
                // ↓ após a criação dos DTOs e o POST estar recebendo agora o DTO, alteramos:
                _repo.Add(evento);

                // Na hora de salvar ele precisa ser assincrono (await).
                // Aqui ele salva toda a mudança de estado.
                if (await _repo.SaveChangeAsync())
                {
                    // Aqui utilizamos o status code 201 que foi salvo com sucesso.
                    //return Created($"/api/evento/{model.Id}", model);
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(evento)); // _mapper.Map<EventoDto>(evento) → retorna fazendo o match entre o evento com EventoDto.
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou {ex.Message}");
            }

            // Caso não tenha dado certo o SaveChangeAsync retorna a mensagem de erro BadRequest.
            return BadRequest();

        }

        // PUT
        [HttpPut("{EventoID}")]
        //public async Task<IActionResult> Put(int EventoId, Evento model)
        // Após a criação dos DTOs alteramos para receber o EventoDto.
        public async Task<IActionResult> Put(int EventoId, EventoDto model)
        {
            try
            {
                // Verifica se encontra algum elemento.
                // Aqui eliminamos que seja feito algum Join no banco de dados com Eventos com Palestrantes
                // procuramos saber somente se o evento foi encontrado.
                var evento = await _repo.GetAllEventoAsyncById(EventoId, false);
                // Se não foi encontrado elemento não é atualizado.
                if (evento == null) return NotFound();

                // Faz o mapeamento recebendo o model e substituindo pelo evento.
                _mapper.Map(model, evento);

                // Caso encontre o elemento segue o código ↓

                // Na atualização do model ele não precisa ser assincrono.
                // Aqui ele muda um estado do EntityFramework.
                // _repo.Update(model);
                // Após o mapeamento faz a atualização dos campos.
                _repo.Update(evento);

                // Na hora de salvar ele precisa ser assincrono (await).
                // Aqui ele salva toda a mudança de estado.
                if (await _repo.SaveChangeAsync())
                {
                    // Aqui utilizamos o status code 201 que foi salvo com sucesso.
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(evento)); // _mapper.Map<EventoDto>(evento) → retorna fazendo o match entre o evento com EventoDto.
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
        public async Task<IActionResult> Delete(int EventoId)
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