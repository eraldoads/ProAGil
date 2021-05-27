import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-palestrantes',
  templateUrl: './palestrantes.component.html',
  styleUrls: ['./palestrantes.component.css']
})
export class PalestrantesComponent implements OnInit {

  // ↓ cria uma variável para informar o nome da tela na página.
  titulo = 'Palestrantes';

  constructor() { }

  ngOnInit() {
  }

}
