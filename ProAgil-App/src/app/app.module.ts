// MODULOS
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Importa o modulo HttpClientModule.
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa o modulo FormsModule.
import { BsDropdownModule, TooltipModule, ModalModule, BsDatepickerModule, } from 'ngx-bootstrap'; // Importa o modulo do NGX-Bootstrap.
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

// SERVIÇOS
import { EventoService } from './_services/evento.service';

// COMPONENTES
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContatosComponent } from './contatos/contatos.component';
import { TituloComponent } from './_shared/titulo/titulo.component';
// PIPE
import { DateTimeFormatPipePipe } from './_helps/DateTimeFormatPipe.pipe';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { AuthInterceptor } from './auth/auth.interceptor';


@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      EventosComponent,
      PalestrantesComponent,
      DashboardComponent,
      ContatosComponent,
      TituloComponent,
      UserComponent,
      LoginComponent,
      RegistrationComponent,
      DateTimeFormatPipePipe
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(), // o "forRoot" é para funcionar em toda a aplicação.
      BsDatepickerModule.forRoot(), // o "forRoot" é para funcionar em toda a aplicação.
      TooltipModule.forRoot(), // o "forRoot" é para funcionar em toda a aplicação.
      ModalModule.forRoot(), // o "forRoot" é para funcionar em toda a aplicação.
      BrowserAnimationsModule, // Requerido para animations module
      ToastrModule.forRoot({
         timeOut: 10000,
         positionClass: 'toast-bottom-right',
         preventDuplicates: true,
       }), // ToastrModule adcionado
      AppRoutingModule,
      HttpClientModule, // Importa o modulo para poder realizar a chamadaHttps.
      FormsModule, // Importa o @angular/forms para poder utilizar o 'Two-way Data Binding' ( Caixa de banana [()] ).
      ReactiveFormsModule,
      CommonModule
   ],
   providers: [
     EventoService,
     {
        // Verificar / Interceptar as requisições HTTP.
        // Adicionado para fazer referência ao 'auth.interceptor.ts' e utilizar no 'evento.service.ts'.
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
     }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
