import { Component, OnInit, TemplateRef } from '@angular/core';
// import { HttpClient } from '@angular/common/http'; // → Retirado depois que foi criado o serviço: Services/evento.service.ts ↓
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


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

  // Para importar as informações:
  // O " = [] " significa que foi atribuido um tipo array ao "any".
  // eventos: any = []; // Deve criar o GetEventos(). → Comentado após a utlização do serviço.
  // eventosFiltrados: any = []; // → Comentado após a utlização do serviço.

  // Deixando mais tipado.
  eventos: Evento[]; // Deve criar o GetEventos().
  eventosFiltrados: Evento[];

  // Variáveis.
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  // filtroLista = '';
  modalRef: BsModalRef;


  // tslint:disable-next-line: variable-name → Comentario para desabilitar a sinalização de atenção na linha ↓.
  _filtroLista: string;

  // constructor(private http: HttpClient) { } // → Modificado após a criação do serviço ↓
  constructor(
      private eventoService: EventoService
    , private modalService: BsModalService
    ) { }

  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }
  /* Encapsulamento - Fim */


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  // tslint:disable-next-line:max-line-length
  // Vai ser executado antes da nossa interface ser implementada ( @Component({ ... }) ), antes do HTML ficar pronto ( templateUrl: './eventos.component.html', ).
  ngOnInit() {
    this.getEventos();
  }

  // Após a criação do serviço anteramos a função ↓.
  // Funções.
  // filtrarEventos(filtrarPor: string) : any{
  //   filtrarPor = filtrarPor.toLocaleLowerCase();
  //   return this.eventos.filter(
  //     evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
  //   );
  // }

  // Alterado para ↓.
  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem; // Recebe o oposto dele mesmo, para mostrar ou não a imagem.
  }

  // Após a criação do serviço anteramos a função ↓.
  // getEventos() {
  //   // pegar as informações que estão dentro da ProAgil.API, para isso deve fazer uma chamada Https.
  //   // Dentro do " app.modules.ts " e em " imports " deve importar o meu " HttpClientModel ".
  //   // Faz uma requisição ajax.
  //   this.http.get('http://localhost:5000/api/values').subscribe( response => {
  //     this.eventos = response;
  //     console.log(); // Mostra na tela as informações que vem do projeto ProAgil.API.
  //   }, error => {
  //     console.log(error);
  //   }); // faz uma resquisição na API, é uma requisição AJAX.
  // }

  // Alterado para ↓.
  getEventos() {
    // Vai buscar as informações dentro do serviço. o HTTP ficou encapsulado dentro do serviço onde existe o método GET.
    // Deixando mais tipado.
    this.eventoService.getAllEvento().subscribe(
      // tslint:disable-next-line: variable-name → Desabilita linha com chamada de atenção.
      (_eventos: Evento[]) => {
      this.eventos = _eventos;
      console.log(_eventos); // Mostra na tela as informações que vem do projeto ProAgil.API.
    }, error => {
      console.log(error);
    }); // Faz uma resquisição na API, é uma requisição AJAX.
  }


}
