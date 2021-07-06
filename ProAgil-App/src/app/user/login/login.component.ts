import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo = 'Login';
  model: any = {};

  // ↓ Faz a injeção dos serviços no contrutor.
  constructor(private authService: AuthService
            , public router: Router
            , private toastr: ToastrService) { }

  ngOnInit() {
    // ↓ Verifica se tem algum usuário, pelo token, no 'localStorage'se tiver direciona para a página inicial.
    if (localStorage.getItem('token') != null) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.authService.login(this.model).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
        this.toastr.success('Usuário logado');
      },
      error => {
        this.toastr.error('Falha no login, verifique seu usuário e senha!');
      });
  }

}
