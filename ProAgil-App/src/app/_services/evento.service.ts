import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

// Decorator
@Injectable({
  providedIn: 'root'
})
export class EventoService {

  baseURL = 'http://localhost:5000/api/evento';

  constructor(private http: HttpClient) { }

  // Colocar que é do tipo Observable.
  getAllEvento(): Observable<Evento[]> {
    // Retorna um Observable.
    return this.http.get<Evento[]>(this.baseURL);
  }

  // Colocar que é do tipo Observable que busca por tema.
  getEventoByTema(tema: string): Observable<Evento[]> {
    // Retorna um Observable.
    return this.http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
  }

  // Colocar que é do tipo Observable que busca por ID.
  getEventoById(id: number): Observable<Evento> {
    // Retorna um Observable.
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  // ↓ Método para receber o POST → as informações do formulário passada por paramêtro.
  postEvento(evento: Evento) {
    // Retorna um Observable.
    return this.http.post(this.baseURL, evento);
  }

  // ↓ Método para receber o PUT → as informações do formulário passada por paramêtro.
  putEvento(evento: Evento) {
    // Retorna um Observable.
    return this.http.put(`${this.baseURL}/${evento.id}`, evento);
  }

  // ↓ Método para deletar um item da tabela.
  deleteEvento(id: number) {
    // Retorna um Observable.
    return this.http.delete(`${this.baseURL}/${id}`);
  }

}
