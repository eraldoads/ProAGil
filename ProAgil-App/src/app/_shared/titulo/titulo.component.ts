import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css']
})
export class TituloComponent implements OnInit {
  // title = 'ProAgil Eventos';
  // ↓ Alterado para receber o nome e alterar o titulo da respectiva tela selecionada:
  @Input() titulo: string;

  constructor() { }

  ngOnInit() {
  }

}
