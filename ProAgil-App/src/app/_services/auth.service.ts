import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = 'http://localhost:5000/api/user/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  // ↓ Criar método de login.
  login(model: any) {
    return this.http
      .post(`${this.baseURL}login`, model).pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            // ↓ Salva o token (user.token) dentro de token ('token') do 'localStorage', esse, é o
            // armazenamento local que existe dentro do browser.
            localStorage.setItem('token', user.token);
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            // console.log(this.decodedToken);
            sessionStorage.setItem('username', this.decodedToken.unique_name);
          }
        })
      );
  }

  // ↓ Criar método para registrar usuário.
  register(model: any) {
    // return this.http.post(`${this.baseURL}login`, model);
    return this.http.post(`${this.baseURL}register`, model);
  }

  // ↓ Criar método para verificar se esta logado.
  loggedIn() {
    // Pega o token que esta dentro do localStorage.
    const token = localStorage.getItem('token');

    // retorna a verificação se o usuário logado não expirou.
    return !this.jwtHelper.isTokenExpired(token);
  }

}
