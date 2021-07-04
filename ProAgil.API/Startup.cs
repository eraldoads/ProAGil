using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ProAgil.Dominio.Identity;
using ProAgil.Repositorio;

namespace ProAgil.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ProAgilContext>(
                x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")) // Dentro do arquivo de configuração " appsettings.Development.json " vai ser criado a " ConnectionString ".
            );
            
            // ↓ Realizar uma configuração que tudo que foi feito, as tabelas, elas serão injetadas nas
            // controles, todas as controles terão que passar por uma autenticação para quem for consumir a API 
            // precise estar autenticado e autorizado para trabalhar com as controles.
            IdentityBuilder builder = services.AddIdentityCore<User>(options => {
                // ↓ Configuração de passaword (senha).
                // Remover ao máximo tudo o que é padrão quando for criar um usuáeio.
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 4;
            });

            builder = new IdentityBuilder(builder.UserType, typeof(Role), builder.Services);

            // ↓ Outras configurações, essa primeira é a mais importante, pois, está falando para o 'EntityFrameworkStores'
            // você continua levando em consideração o seu contexto para trabalhar com todos os outro detalhes que serão
            // relacionados logo abaixo dele.
            // Configuração de Contexto e de Roles.
            builder.AddEntityFrameworkStores<ProAgilContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>(); // ← gerenciador de papéis.
            builder.AddSignInManager<SignInManager<User>>(); // ← Controle de cadastro de usuário.

            // ↓ JWT
            // Toda a configuração realizada acima vai ser realizada / autenticada por meio do JWT.
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                        // ↓ verifica qual a configuração esperada em um portador (Bearer) JWT.
                        options.TokenValidationParameters = new TokenValidationParameters{
                            // Faz a instânciação passando os parametros desejados.
                            ValidateIssuerSigningKey = true, // ← Configura o emissor.
                            // ↓ Valida pela assinatura da chave do emissor.
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                                // ↓ passa uma configuração que deve ser colocada dentro do arquivo de configuração "appsettings.Development.json"
                                .GetBytes(Configuration.GetSection("AppSettings:Token").Value)), // ← Busca o valor da chave.
                            ValidateIssuer = false,
                            ValidateAudience = false,
                        };
                    }
                );

            // ↓ O 'AddMvc' é quem determina a configuração da chamada de uma determinada controler.
            // Toda vez que for chamada uma determinada controler é criada uma politica.
            services.AddMvc(options => {
                    // Todas as vezes que alguém chamar uma rota, essa rota vai requerir 
                    // que o usuário esteja autenticado.
                    var policy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build();
                    // ↓ Aqui faz o filtro de todas as chamadas com a politica criada.
                    options.Filters.Add(new AuthorizeFilter(policy));
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                // ↓ Controle de redundancia que tiver em relação ao retorno da serialização dos itens.
                // Resolve o problema em caso de looping infinito.
                .AddJsonOptions(opt => opt.SerializerSettings.ReferenceLoopHandling = 
                    Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            // ↓ Aqui ele injeta o repositório para quem precisar / herdar.
            services.AddScoped<IProAgilRepositorio, ProAgilRepositorio>();
            // ↓ Aqui faz a referencia, informando que a aplicação vai trabalhar com o AutoMapper entre classes.
            services.AddAutoMapper();
            // ↓ Configuração para que permita utilizar informação cruzada no servidor.
            //   Necessário para o projeto ProAgil-APP possa acessar as informações do API.
            services.AddCors();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            // A aplicação que vai gerar o builder. Vai dizer que ele tem que ser autenticado
            // utilizando o token (JWT).
            app.UseAuthentication();

            //app.UseHttpsRedirection();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseStaticFiles(); // Para poder utilizar imagens. Encontra as imagens dentro do servidor, dentro da pasta 'wwwroot/img/'.
            // ↓ Passa um parametro criando uma instância.
            app.UseStaticFiles(new StaticFileOptions(){
                // ↓ Dentro dessa instância, toda vez que for pegar um arquivo
                // ele estará disponibilizado no diretorio Resources.
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
                // ↓ aqui especificamos que toda vez que for realizado um request ele vai pegar do "/Resources".
                RequestPath = new PathString("/Resources")
            });
            app.UseMvc();
        }
    }
}
