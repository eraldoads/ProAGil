import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // Cria um construtor.
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // ↓ Verifica se existe um token no localStorage do navegador para permitir ou bloquear
    // a entrada nas rotas/páginas. especificar no 'app-routing.module.ts'.
    if (localStorage.getItem('token') !== null) {
      return true;
    } else {
      this.router.navigate(['/user/login']);
      return false;
    }
  }
  
}
