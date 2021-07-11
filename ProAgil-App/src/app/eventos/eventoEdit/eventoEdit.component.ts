import { Component, OnInit, ViewChild } from '@angular/core';
import { EventoService } from 'src/app/_services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evento-edit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.css']
})
export class EventoEditComponent implements OnInit {

  public customPatterns = { A: { pattern: new RegExp('')} };

  titulo = 'Editar Evento';
  evento: Evento = new Evento(); // ← Foi necessário transformar a interface do 'Evento' em um classe.

  imagemURL = 'assets/img/ImgUpload.png';
  registerForm: FormGroup;
  file: File;
  fileNameToUpdate: string;

  dataAtual = '';

  get lotes(): FormArray {
    return this.registerForm.get('lotes') as FormArray;
  }

  get redesSociais(): FormArray {
    return this.registerForm.get('redesSociais') as FormArray;
  }

  constructor(private eventoService: EventoService
            , private fb: FormBuilder
            , private localeService: BsLocaleService
            , private toastr: ToastrService
            , private router: ActivatedRoute
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }

  carregarEvento() {
    // this.removerLote(0);
    // this.removerRedeSocial(0);
    // ↓ Pegando ao id do evento por meio da rota.
    const idEvento = +this.router.snapshot.paramMap.get('id'); // ← o '+' serve para converter para number.
    // ↓ getEventoBuId - por ser um 'Observable' e para executar é preciso fazer o subscribe.
    this.eventoService.getEventoById(idEvento)
      .subscribe(
        // ↓ Carrega o objeto. Aqui é onde é criada a validação dos campos.
        (evento: Evento) => {
          this.evento = Object.assign({}, evento);
          this.fileNameToUpdate = evento.imagemURL.toString();

          this.dataAtual = new Date().getMilliseconds().toString();
          this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;

          /* ↓ Necessidade de limpar a propriedade, porque se tentar atribuir informação para ele
              o componente de upload, dentro da página 'eventoEdit.componente.html:
              ' <img [src]="imagemURL" class="img-fluid" (click)="file.click()" style="cursor: pointer; width: 350px;"
              alt="Card image cap" /> '
              ele não é SET ele é GET, só pega a informação, se tentar atribuir informação
              para ele, vai automaticamente estorar um erro, com isso, o registerForm com o campo imageURL vai
              ficar vazio, ele só vai ser preenchido caso seja alterado a informação da imagem.
          */
          this.evento.imagemURL = '';
          this.registerForm.patchValue(this.evento);

          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criaLote(lote));
          });
          this.evento.redesSociais.forEach(redeSocial => {
            this.redesSociais.push(this.criaRedeSocial(redeSocial));
          });
        },
        (error) => {
          this.toastr.error(
            `Falha ao carregar o evento. Messagem: ${error}`, 'Erro'
          );
        }
      );
  }

  validation() {
    // ↓ Aqui é dado o start na validação dos campos.
    this.registerForm = this.fb.group({
      id: [],
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: [''],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([])
    });
  }

  // ↓ Função para atribuir as informações e cria o objeto do Lote.
  criaLote(lote: any): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  // ↓ Função para atribuir as informações e cria o objeto das Redes Sociais.
  criaRedeSocial(redeSocial: any): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    });
  }

  adicionarLote() {
    // ↓ Cria o lote e atribui o id igual a 0 por se tratar da inclusão de um novo registro
    // e não de uma edição.
    this.lotes.push(this.criaLote({ id: 0 }));
  }

  adicionarRedeSocial() {
    // Cria a Rede Social e atribui o id igual a 0 por se tratar da inlcusão de um novo registro
    // e não de uma edição.
    this.redesSociais.push(this.criaRedeSocial({ id: 0 }));
  }

  removerLote(id: number) {
    this.lotes.removeAt(id);
  }

  removerRedeSocial(id: number) {
    this.redesSociais.removeAt(id);
  }

  onFileChange(evento: any, file: FileList) {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = evento.target.files;
    reader.readAsDataURL(file[0]);
  }

  salvarEvento() {
    this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
    // ↓ como ele foi atribuido como vazio, temos que pegar e preencher a informação com o nome que sempre teve.
    this.evento.imagemURL = this.fileNameToUpdate;

    // console.log(this.evento); // Verificar o que esta retornando.

    this.uploadImagem();

    this.eventoService.putEvento(this.evento).subscribe(
      () => {
        this.toastr.success('Editado com Sucesso!');
      }, error => {
        this.toastr.error(`Erro ao Editar: ${error}`);
      }
    );
  }

  uploadImagem() {
    // ↓ Faz a troca da imagem somente se o valor da imagem for diferente de vazio.
    if (this.registerForm.get('imagemURL').value !== '') {
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            // ↓ Quando acaba de enviar a nova imagem, essa, é atualizada na dataAtual e
            // vem e recarrega aqui na página. Altera a imagem mas mante com o mesmo nome.
            this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
          }
        );
    }
  }

  // Função de clique para voltar a página anterior.
  voltarPagina() {
    window.history.back();
  }

}
