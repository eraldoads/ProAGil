import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private authService: AuthService
            , public router: Router
            , public toastr: ToastrService) { }

  ngOnInit() {
  }

  // ↓ Função que mostra ou não a barra de navegação se tiver algum usuário logado ou não.
  loggedIn() {
    return this.authService.loggedIn();
  }

  nomeUsuario() {
     return sessionStorage.getItem('username');
  }

  entrar() {
    this.router.navigate(['/user/login']);
  }

  logout() {
    // ↓ Limpar o localStorage.
    localStorage.removeItem('token');
    // ↓ Mostra mensagem na tela.
    this.toastr.show('Usuário saiu do sistema');
    // ↓ Direciona para a página.
    this.router.navigate(['/user/login']);
  }

}
