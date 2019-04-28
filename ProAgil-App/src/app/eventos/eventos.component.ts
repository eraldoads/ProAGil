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

  // Para importar as informações:
  eventos: any; // criar o GetEventos().

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:max-line-length
  // Vai ser executado antes da nossa interface ser implementada ( @Component({ ... }) ), antes do HTML ficar pronto ( templateUrl: './eventos.component.html', ).
  ngOnInit() {
    this.getEventos();
  }

  getEventos() {
    // pegar as informações que estão dentro da ProAgil.API, para isso deve fazer uma chamada Https.
    // Dentro do " app.modules.ts " e em " imports " deve importar o meu " HttpClientModel ".
    this.http.get('http://localhost:5000/api/values').subscribe( response => {
      this.eventos = response;
      console.log(); // Mostra na tela as informações que vem do projeto ProAgil.API.
    }, error => {
      console.log(error);
    }); // faz uma resquisição na API, é uma requisição AJAX.
  }

}
