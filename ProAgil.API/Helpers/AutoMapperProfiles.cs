using System.Linq;
using AutoMapper;
using ProAgil.API.Dtos;
using ProAgil.Dominio;

namespace ProAgil.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // Faz o mapeamente entre os Dominios e os DTOs fazendo o match entre eles.
            CreateMap<Evento, EventoDto>()
                .ForMember(dest => dest.Palestrantes, opt => {
                    opt.MapFrom(src => src.PalestrantesEventos.Select(x => x.Palestrante).ToList());
                }).ReverseMap(); // → informa que está trabalhando com um mapeamento diferenciado. Faz as associações.
            
            // Mapeamento do DTO de forma invertida, para utilizar no método POST.
            //CreateMap<EventoDto, Evento>(); // Alterado para utilizar o .ReverseMap() ↑ que funciona da mesma forma.

            CreateMap<Palestrante, PalestranteDto>()
                .ForMember(dest => dest.Eventos, opt => {
                    opt.MapFrom(src => src.PalestrantesEventos.Select(x => x.Evento).ToList());
                }).ReverseMap(); // → informa que está trabalhando com um mapeamento diferenciado. Faz as associações.
            
            CreateMap<Lote, LoteDto>().ReverseMap();
            // Mapeamento do DTO de forma invertida, para utilizar no método POST.
            //CreateMap<LoteDto, Lote>(); // Alterado para utilizar o .ReverseMap() ↑ que funciona da mesma forma.

            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
            // Mapeamento do DTO de forma invertida, para utilizar no método POST.
            //CreateMap<RedeSocialDto, RedeSocial>(); // Alterado para utilizar o .ReverseMap() ↑ que funciona da mesma forma.

        }
    }
}