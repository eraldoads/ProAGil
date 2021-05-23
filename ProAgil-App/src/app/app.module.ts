// MODULOS
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Importa o modulo HttpClientModule.
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa o modulo FormsModule.
import { AppRoutingModule } from './app-routing.module';
import { BsDropdownModule, TooltipModule, ModalModule, BsDatepickerModule, } from 'ngx-bootstrap'; // Importa o modulo do NGX-Bootstrap.
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// SERVIÇOS
import { EventoService } from './_services/evento.service';

// COMPONENTES
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { NavComponent } from './nav/nav.component';

// PIPE
import { DateTimeFormatPipePipe } from './_helps/DateTimeFormatPipe.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
   declarations: [
      AppComponent,
      EventosComponent,
      NavComponent,
      DateTimeFormatPipePipe
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(), // o "forRoot" é para funcionar em toda a aplicação.
      BsDatepickerModule.forRoot(), // o "forRoot" é para funcionar em toda a aplicação.
      TooltipModule.forRoot(), // o "forRoot" é para funcionar em toda a aplicação.
      ModalModule.forRoot(), // o "forRoot" é para funcionar em toda a aplicação.
      AppRoutingModule,
      HttpClientModule, // Importa o modulo para poder realizar a chamadaHttps.
      FormsModule, // Importa o @angular/forms para poder utilizar o 'Two-way Data Binding' ( Caixa de banana [()] ).
      ReactiveFormsModule,
      CommonModule
   ],
   providers: [
     EventoService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
