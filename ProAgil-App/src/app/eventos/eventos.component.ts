import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  // eventos: any = [
  //   {
  //     EventoID: 1,
  //     Tema: 'Angular',
  //     Local: 'Porto Alegre'
  //   },
  //   {
  //     EventoID: 2,
  //     Tema: 'NodeJS',
  //     Local: 'Canoas'
  //   },
  //   {
  //     EventoID: 3,
  //     Tema: '.NET Core',
  //     Local: 'Cachoeirinha'
  //   },
  // ];

  // Propriedades.
  // Comentamos a variável criada e agora vamos declarar como sendo uma propriedade para utilizar nos filtros de busca.
  /* Encapsulamento - Inicio */
  // tslint:disable-next-line: variable-name -> comentario para retirar da linha a sinalização de atencão/erro.
  _filtroLista: string;

  get filtroLista() : string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }
  /* Encapsulamento - Fim */

  // Para importar as informações:
  // O " = [] " significa que foi atribuido um tipo array ao "any".
  eventos: any = []; // Deve criar o GetEventos().
  eventosFiltrados: any = [];

  // Variáveis.
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  // filtroLista = '';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:max-line-length
  // Vai ser executado antes da nossa interface ser implementada ( @Component({ ... }) ), antes do HTML ficar pronto ( templateUrl: './eventos.component.html', ).
  ngOnInit() {
    this.getEventos();
  }

  // Funções.
  filtrarEventos(filtrarPor: string) : any{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem; // Recebe o oposto dele mesmo, para mostrar ou não a imagem.
  }

  getEventos() {
    // pegar as informações que estão dentro da ProAgil.API, para isso deve fazer uma chamada Https.
    // Dentro do " app.modules.ts " e em " imports " deve importar o meu " HttpClientModel ".
    // Faz uma requisição ajax.
    this.http.get('http://localhost:5000/api/values').subscribe( response => {
      this.eventos = response;
      console.log(); // Mostra na tela as informações que vem do projeto ProAgil.API.
    }, error => {
      console.log(error);
    }); // faz uma resquisição na API, é uma requisição AJAX.
  }

}
