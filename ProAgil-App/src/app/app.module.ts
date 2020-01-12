import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Importa o modulo HttpClientModule.
import { FormsModule } from '@angular/forms'; // Importa o modulo FormsModule.

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { HttpClient } from 'selenium-webdriver/http';
import { NavComponent } from './nav/nav.component';

@NgModule({
   declarations: [
      AppComponent,
      EventosComponent,
      NavComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule, // Importa o modulo para poder realizar a chamadaHttps.
      FormsModule // Importa o @angular/forms para poder utilizar o 'Two-way Data Binding' ( Caixa de banana [()] ).
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
