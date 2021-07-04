using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ProAgil.API.Dtos;
using ProAgil.Dominio.Identity;

// ↓ Controler criada responsável por utilizarmos todo o aparato do 'IdentityCore'.
namespace ProAgil.API.Controllers
{
    // ↓ Especificar que ela tem uma rota.
    [Route("api/[controller]")]
    [ApiController] // Indica que é uma API que deve ser autenticada seguindo as politicas desenvolvidas no "Startup.cs".
    public class UserController : ControllerBase // ← Herda de 'ControllerBase'
    {
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;

        // ↓ Cria o construtor
        // A controler é instanciada dentro do 'Startup.cs'.
        public UserController(IConfiguration config,
                              UserManager<User> userManager,
                              SignInManager<User> signInManager,
                              IMapper mapper)
        {
            // ↓ Lembrando: Todas as vezes que é instanciada uma controller, ou seja, que é chamada a controller
            // via protocolo HTTP e esses parametros sempre são passados via injeção de dependências.
            _config = config;
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
        }

        [HttpGet("GetUser")]
        // public async Task<IActionResult> GetUser()
        public IActionResult GetUser()
        {
            return Ok(new UserDto());
        }

        [HttpPost("Register")]
        [AllowAnonymous] // Utilizado para não utilizar as politicas de autenticação criadas no Statup.cs.
        //Registra/insere um novo usuário.
        //Recebe a informação do UserDto para fazer o Map, ou seja, mapear as informações para passar para o EntityFrameWork.
        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                // Fazer o mapeamento e o match entre o userDto e o User, ou seja, ele pega o jSon do userDto e passa para 
                // o User do EntityFrameWork.
                var user = _mapper.Map<User>(userDto);
                // Vai no banco e cria o novo registro.
                var result = await _userManager.CreateAsync(user, userDto.Password);
                // Faz o mapeamento do User para o UserDto.
                var userToReturn = _mapper.Map<UserDto>(user);

                // Retornar somente se teve sucesso na execução
                if (result.Succeeded)
                {
                    // Retorna quem acabou de adicionar.
                    return Created("GetUser", userToReturn);
                }

                // Retorna o erro no caso de ter acontecido algum problema.
                return BadRequest(result.Errors);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados falhou {ex.Message}");
            }
        }

        // Parte de fazer o login
        [HttpPost("Login")]
        [AllowAnonymous] // Utilizado para não utilizar as politicas de autenticação criadas no Statup.cs.
        public async Task<IActionResult> Login(UserLoginDto userLogin)
        {
            try
            {
                // Verifica no Banco de Dados se o userName existe.
                var user = await _userManager.FindByNameAsync(userLogin.UserName);
                // Verifica no Banco de dados se este usuário tem a senha informada.
                var result = await _signInManager.CheckPasswordSignInAsync(user, userLogin.Password, false); // false é para não travar o banco de dados
                
                // Retornar somente se teve sucesso.
                if (result.Succeeded)
                {
                    //var appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.NormalizedUserName == userLogin.UserName);
                    //var userToReturn = _mapper.Map<UserLoginDto>(appUser);

                    var appUser = await _userManager.Users
                        .FirstOrDefaultAsync(u => u.NormalizedUserName == userLogin.UserName.ToUpper());

                    var userToReturn = _mapper.Map<UserLoginDto>(appUser);

                    // Retorna um objeto.
                    return Ok(new {
                        // Gera o Token baseado no usuário que foi encontrado pelo '_userManager' (ele tem uma lista de usuários)
                        token = GenerateJWToken(appUser).Result,
                        user = userToReturn
                    });
                }

                return Unauthorized();
                
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados falhou {ex.Message}");
            }
        }

        private async Task<string> GenerateJWToken(User user)
        {
            // As 'Claims' é como se tivesse reivindicando determinadas autorizações.
            // Neste momento das Claims é feita questão de autorização, ou seja, já foi autenticado 
            // agora verifica se tem alguma autorização.
            var claims = new List<Claim>{
                // Adicionar a 'Claim' os seguintes detalhes:
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            // Verificar quais os papeis que esse usuário possui. Faz a busca no banco de dados.
            // Roles são os papeis dentro do sistema que pode ser administrador, gerente, editor, usuário, etc.
            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                // Adiciona mais um detalha a 'Claim'.
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Montar qual é o tokebn que vai ser passado para o usuário quando ele realizar o login.
            var key = new SymmetricSecurityKey(Encoding.ASCII
                // ↓ passa uma configuração que deve ser colocada dentro do arquivo de configuração "appsettings.Development.json"
                .GetBytes(_config.GetSection("AppSettings:Token").Value)); // ← Busca o valor da chave.

            // Escolhe qual é o algoritmo que vai ser assinado, ou seja, fará a criptografia
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // Monta o token.
            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}