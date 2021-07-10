import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ContatosComponent } from './contatos/contatos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventoEditComponent } from './eventos/eventoEdit/eventoEdit.component';
import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserComponent } from './user/user.component';

// ↓ Configurações de rotas.
const routes: Routes = [
  { path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent }
    ]
  },
  { path: 'eventos', component: EventosComponent, canActivate: [AuthGuard] },
  { path: 'evento/:id/edit', component: EventoEditComponent, canActivate: [AuthGuard] }, // ← Rota do eventoEdit, tela de editar evento.
  { path: 'palestrantes', component: PalestrantesComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'contatos', component: ContatosComponent, canActivate: [AuthGuard] },
  // ↓ Direciona para o dashboard caso informe uma URL vazia, como: "http://localhost:4200/".
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  // ↓ Direciona para o dashboard caso infome uma URL inexistente, como: "http://localhost:4200/xpto".
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
