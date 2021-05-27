import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent implements OnInit {

  // ↓ cria uma variável para informar o nome da tela na página.
  titulo = 'Contatos';

  constructor() { }

  ngOnInit() {
  }

}
