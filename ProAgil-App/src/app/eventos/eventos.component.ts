import { Component, OnInit, TemplateRef } from '@angular/core';
// import { HttpClient } from '@angular/common/http'; // → Retirado depois que foi criado o serviço: Services/evento.service.ts ↓
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';

defineLocale('pt-br', ptBrLocale); // → Definir a linguagem do calendario para o formato PortuguÊs Brasil.

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  //#region → Comentario código
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
  //#endregion

  // Propriedades.
  // Comentamos a variável criada e agora vamos declarar como sendo uma propriedade para utilizar nos filtros de busca.
  /* Encapsulamento - Inicio */
  // tslint:disable-next-line: variable-name -> comentario para retirar da linha a sinalização de atencão/erro.

  // Para importar as informações:
  // O " = [] " significa que foi atribuido um tipo array ao "any".
  // eventos: any = []; // Deve criar o GetEventos(). → Comentado após a utlização do serviço.
  // eventosFiltrados: any = []; // → Comentado após a utlização do serviço.

  // Deixando mais tipado.
  eventos: Evento[] = []; // Deve criar o GetEventos() atribuindo um 'array' para utilizar o 'length' no 'eventos.component.html'.
  eventosFiltrados: Evento[];

  evento: Evento;
  modoSalvar = 'post';

  // Variáveis.
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  // filtroLista = '';
  // modalRef: BsModalRef;
  registerForm: FormGroup;
  bodyDeletarEvento = '';

  // tslint:disable-next-line: variable-name → Comentario para desabilitar a sinalização de atenção na linha ↓.
  _filtroLista: string;

  // constructor(private http: HttpClient) { } // → Modificado após a criação do serviço, faz a injeção do serviço ↓
  constructor(
      private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
  ) {
    this.localeService.use('pt-br'); // → Com isso o calendário já fica com a linguagem Português Brasil.
  }

  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }
  /* Encapsulamento - Fim */

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = evento;
    this.registerForm.patchValue(this.evento);
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  openModal(template: any) {
    // this.modalRef = this.modalService.show(template);
    this.registerForm.reset();
    template.show();
  }

  // tslint:disable-next-line:max-line-length
  // Vai ser executado antes da nossa interface ser implementada ( @Component({ ... }) ), antes do HTML ficar pronto ( templateUrl: './eventos.component.html', ).
  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  //#region → Após a criação do serviço alteramos a função ↓.
  // Funções.
  // filtrarEventos(filtrarPor: string) : any{
  //   filtrarPor = filtrarPor.toLocaleLowerCase();
  //   return this.eventos.filter(
  //     evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
  //   );
  // }
  //#endregion

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

  validation() {
    //#region → treho comentado por ser criado outro tipo de tratamento.
    // É desncessário ter que criar para todo o campo um ' new FormControl ', dentro do construtor
    // é criado o ' private fb: FormBuilder '.
    // this.registerForm = new FormGroup({
    //   tema: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
    //   local: new FormControl('', Validators.required),
    //   dataEvento: new FormControl('', Validators.required),
    //   imagemURL: new FormControl('', Validators.required),
    //   qtdPessoas: new FormControl('', [Validators.required, Validators.max(120000)]),
    //   telefone: new FormControl('', Validators.required),
    //   email: new FormControl('', [Validators.required, Validators.email])
    // });
    //#endregion

    // Aqui utilizamos o FormBuilder
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

  }

  salvarAlteracao(template: any) {
    // Verifica se o formulário está valido
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        // ↓ Evento recebe um "COP", assim copia todos os valores do formulário e atribui para dentro do 'this.evento'.
        this.evento = Object.assign({}, this.registerForm.value);
        // ↓ Passar por parametro para o serviço.
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            template.hide(); // Fecha o a tela do modal.
            this.getEventos(); // Atualiza a grid com as informações.
          }, error => {
            console.log(error);
          }
          ); // Precisa do subscribe por ser um metodo "Observable".
        } else {
          // ↓ Evento recebe um "COP", assim copia todos os valores do formulário e atribui para dentro do 'this.evento'.
          this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
          // ↓ Passar por parametro para o serviço.
          this.eventoService.putEvento(this.evento).subscribe(
            () => {
              template.hide(); // Fecha o a tela do modal.
              this.getEventos(); // Atualiza a grid com as informações.
            }, error => {
              console.log(error);
            }
            ); // Precisa do subscribe por ser um metodo "Observable".
          }
        }
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
      }, error => {
        console.log(error);
      }
      );
  }

  //#region → Altera função:
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
  //#endregion

  // Alterado para ↓.
  getEventos() {
    // Vai buscar as informações dentro do serviço (pasta _services). o HTTP ficou encapsulado dentro do
    // serviço onde existe o método GET. Deixando mais tipado.
    this.eventoService.getAllEvento().subscribe(
      // tslint:disable-next-line: variable-name → Desabilita linha com chamada de atenção.
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
        console.log(_eventos); // Mostra na tela as informações que vem do projeto ProAgil.API.
      }, error => {
        console.log(error);
      }
    ); // Faz uma resquisição na API, é uma requisição AJAX.
  }
}
