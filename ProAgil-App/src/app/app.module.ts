import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Importa o modulo HttpClientModule.

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { HttpClient } from 'selenium-webdriver/http';

@NgModule({
   declarations: [
      AppComponent,
      EventosComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule // Importa o modulo para poder realizar a chamada Https.
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
