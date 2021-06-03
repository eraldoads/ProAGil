import { Component, OnInit, TemplateRef } from '@angular/core';
// import { HttpClient } from '@angular/common/http'; // → Retirado depois que foi criado o serviço: Services/evento.service.ts ↓
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

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

  // ↓ cria uma variável para informar o nome da tela na página.
  titulo = 'Eventos';

  // Propriedades.
  // Comentamos a variável criada e agora vamos declarar como sendo uma propriedade para utilizar nos filtros de busca.
  /* Encapsulamento - Inicio */
  // tslint:disable-next-line: variable-name -> comentario para retirar da linha a sinalização de atencão/erro.

  // Para importar as informações:
  // O " = [] " significa que foi atribuido um tipo array ao "any".
  // eventos: any = []; // Deve criar o GetEventos(). → Comentado após a utlização do serviço.
  // eventosFiltrados: any = []; // → Comentado após a utlização do serviço.

  // Deixando mais tipado.
  // tslint:disable-next-line: max-line-length
  eventos: Evento[] = []; // Deve criar o GetEventos() atribuindo um 'array' para utilizar o 'length' no 'eventos.component.html' no '<tfoot *ngIf="!eventos.length">'.
  // eventos: Evento[] // Ao utilizar essa forma, dentro do 'eventos.component.html' tem que mudar para '<tfoot *ngIf="!eventos">'.
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

  // ↓ Cria uma variável para o arquivo de imagem.
  file: File;
  // ↓ Cria uma variável para receber o nome da imagem.
  fileNameUpdate: string;
  // ↓ Cria uma variável para receber a data atual.
  dataAtual: string;

  // tslint:disable-next-line: variable-name → Comentario para desabilitar a sinalização de atenção na linha ↓.
  _filtroLista: string;

  // constructor(private http: HttpClient) { } // → Modificado após a criação do serviço, faz a injeção do serviço ↓
  constructor(
      private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
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

   // ↓ CÓDIGO RETIRADO para ajuste ao clicar no editar e a imagem some e da erro no console.
   // this.evento = evento; // Isso é um Binding.
   // // ↓ uma solução "Paliativa" para que não apresente erro ao cliclar em Editar evento.
   // evento.imagemURL = ''; // Deixando como vazio ele não vai tentar inserir algo. Isso é um Binding.
   // this.registerForm.patchValue(evento);

    // ↓ CÓDIGO SUBSTITUIDO para copiar as informações para dentro de um "evento".
    // Esse evento esta sofrendo um "Bind do Two-Way Data Biding"
    // na grid da tela, ao clicar em editar a imagem some e da erro no console. Com isso deve remover o Binding
    // por meio de uma copia que estão dentro do 'evento'.
    this.evento = Object.assign({}, evento);
    // ↓ Atribui à variável o valor real da imagem.
    this.fileNameUpdate = evento.imagemURL.toString();

    // ↓ uma solução "Paliativa" para que não apresente erro ao cliclar em Editar evento.
    // Deixando como vazio ele não vai tentar inserir algo e com essa alteração não está
    // mais sendo limpado o evento que esta sendo passado por parametro, agora, está
    // sendo limpada a cópia que foi feita dele.
    this.evento.imagemURL = '';
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
    //#region → trecho comentado por ser criado outro tipo de tratamento.
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

  onFileChange(event) {
    const reader = new FileReader();

    // ↓ Aqui verificamos se o arquivo tem uma imagem e se ele realmemte tem um tamanho.
    if (event.target.files && event.target.files.length) {
      // ↓ Aqui temos a atribuição do nosso arquivo que está dentro do nosso
      // Evento que tem o Target que tem o arquivo
      this.file = event.target.files;
      // console.log(this.file); // Verificar o que retorna no console do navegador.
    }
  }

  // Método criado para refaturar e não ter código repetido dentro de outros médotos.
  uploadImagem() {
    // ↓ Tratamento para alterar a imagem sem incluir uma nova no 'Resources\Images'.
    // no caso do de um 'POST' continua fazendo o que já fazia.
    if (this.modoSalvar === 'post') {
      // ↓ Como o arquivo vem carregado com um nome "Fake", precisa fazer
      // um tratamento para pegar o nome corretamente
      const nomeArquivo = this.evento.imagemURL.split('\\', 3);
      this.evento.imagemURL = nomeArquivo[2];

      // ↓ Chamar primeiro o save do arquivo.
      // Com temos uma promise temos que dar um subscribe nele.
      this.eventoService.postUpload(this.file, nomeArquivo[2])
      .subscribe(
        () => {
          // → Para que não seja sempre adicionada uma nova imagem no servidor, desta forma, existe a
          // necessidade de fazer uma "gambiarra" para que ao alterar a imagem, e assim, ela será atualizada
          // e carregará a grid na tela com a nova imagem salva.
          this.dataAtual = new Date().getMilliseconds().toString(); // essa é a "gambiarra".

          this.getEventos();
        }
      );
    } else { // ↓ No caso de um 'PUT'
      // ↓ Recebe o nome exato da imagem que foi cadastrada no banco de dados.
      this.evento.imagemURL = this.fileNameUpdate;
      // ↓ Passamos uma nova variável "criando um valor(nome do arquivo) que já esta no banco de dados".
      this.eventoService.postUpload(this.file, this.fileNameUpdate)
      .subscribe(
        () => {
          // → Para que não seja sempre adicionada uma nova imagem no servidor, desta forma, existe a
          // necessidade de fazer uma "gambiarra" para que ao alterar a imagem, e assim, ela será atualizada
          // e carregará a grid na tela com a nova imagem salva.
          this.dataAtual = new Date().getMilliseconds().toString(); // essa é a "gambiarra".

          this.getEventos();
        }
      );

    }
  }

  salvarAlteracao(template: any) {
    // Verifica se o formulário está valido.
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        // ↓ Evento recebe um "COP", assim copia todos os valores do formulário e atribui para dentro do 'this.evento'.
        this.evento = Object.assign({}, this.registerForm.value);

        //// ↓ Chamar primeiro o save do arquivo.
        //// Com temos uma promise temos que dar um subscribe nele.
        // this.eventoService.postUpload(this.file).subscribe();

        //// ↓ Como o arquivo vem carregado com um nome "Fake", precisa fazer
        //// um tratamento para pegar o nome corretamente
        // const nomeArquivo = this.evento.imagemURL.split('\\', 3);
        // this.evento.imagemURL = nomeArquivo[2];

        // ↓ Criado metodo para que não tenha código repetido.
        this.uploadImagem();

        // ↓ Passar por parametro para o serviço.
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            template.hide(); // Fecha o a tela do modal.
            this.getEventos(); // Atualiza a grid com as informações.
            this.toastr.success('Item inserido com sucesso!', 'Excelente');
          }, error => {
            // console.log(error);
            // ↓ Alterado para utilizar o Toastr GX → Mensagem que é apresentada na tela.
            this.toastr.error(`Erro ao inserir: ${error}`, 'Erro');
          }
          ); // Precisa do subscribe por ser um metodo "Observable".
        } else {
          // ↓ Evento recebe um "COP", assim copia todos os valores do formulário e atribui para dentro do 'this.evento'.
          this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

          //// ↓ Chamar primeiro o save do arquivo.
          //// Com temos uma promise temos que dar um subscribe nele.
          // this.eventoService.postUpload(this.file).subscribe();

          //// ↓ Como o arquivo vem carregado com um nome "Fake", precisa fazer
          //// um tratamento para pegar o nome corretamente
          // const nomeArquivo = this.evento.imagemURL.split('\\', 3);
          // this.evento.imagemURL = nomeArquivo[2];

          // ↓ Criado metodo para que não tenha código repetido.
          this.uploadImagem();

          // ↓ Passar por parametro para o serviço.
          this.eventoService.putEvento(this.evento).subscribe(
            () => {
              template.hide(); // Fecha o a tela do modal.
              this.getEventos(); // Atualiza a grid com as informações.
              this.toastr.success('Item editado com sucesso!', 'Excelente');
            }, error => {
              // console.log(error);
              // ↓ Alterado para utilizar o Toastr NGX → Mensagem que é apresentada na tela.
              this.toastr.error(`Erro ao editar: ${error}`, 'Erro');
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
        this.toastr.success('Item excluído com sucesso!', 'Excelente');
      }, error => {
        this.toastr.error('Erro ao tentar excluir item!', 'Erro');
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
        // console.log(_eventos); // Mostra na tela as informações que vem do projeto ProAgil.API.
      }, error => {
        // console.log(error);
        // colocado para dar uma evidenciada na tela no caso de erro.
        this.toastr.error(`Erro ao tentar carregar eventos: ${error}`, 'Erro');
      }
    ); // Faz uma resquisição na API, é uma requisição AJAX.
  }
}
