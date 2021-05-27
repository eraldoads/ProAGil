import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContatosComponent } from './contatos/contatos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';

// Configurações de rotas.
const routes: Routes = [
  { path: 'eventos', component: EventosComponent },
  { path: 'palestrantes', component: PalestrantesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contatos', component: ContatosComponent },
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
