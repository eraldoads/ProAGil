import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

// Decorator
@Injectable({
  providedIn: 'root'
})
export class EventoService {

  baseURL = 'http://localhost:5000/api/evento';
  // tokenHeader: HttpHeaders; // ← retirado após criado o interceptador 'auth.interceptor.ts'.

  constructor(private http: HttpClient) {
    /* ↓ retirado após criado o interceptador 'auth.interceptor.ts'.
      // ↓ Armazena o token de autenticação para acessar o banco de dados e retornar com os eventos.
      // this.tokenHeader = new HttpHeaders({  Authorization: `Bearer ${localStorage.getItem('token')}` });
    */
   }

  // Colocar que é do tipo Observable.
  getAllEvento(): Observable<Evento[]> {
    /* ↓ retirado após criado o interceptador 'auth.interceptor.ts'.
      //return this.http.get<Evento[]>(this.baseURL, { headers: this.tokenHeader });
    */
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

  // ↓ Método que é chamado pela rota do DotNet que é o /upload com o arquivo selecionado na tela que é o formData.
  postUpload(file: File, name: string) {
    // ↓ Montar o arquivo. como o arquivo é um array apontamos ele para a 1ª posição.
    // const fileToUpload = <File>file[0];
    const fileToUpload = file[0] as File; // Alterado conforme orientação do 'TsLint'.
    // ↓ Criamos um formDatra, pois é o que vamos enviar.
    const formData = new FormData();
    // ↓ Esse formData deve receber:
    // formData.append('file', fileToUpload, fileToUpload.name);
    // MODIFICADO pois está recebendo o 'name' do arquivo como parametro.
    formData.append('file', fileToUpload, name);

    /* ↓ retirado após criado o interceptador 'auth.interceptor.ts'.
      return this.http.post(`${this.baseURL}/upload`, formData, { headers: this.tokenHeader });
    */
    return this.http.post(`${this.baseURL}/upload`, formData);
  }

  // ↓ Método para receber o POST → as informações do formulário passada por paramêtro.
  postEvento(evento: Evento) {
    /* ↓ retirado após criado o interceptador 'auth.interceptor.ts'.
      return this.http.post(this.baseURL, evento, { headers: this.tokenHeader });
    */
    // Retorna um Observable.
    return this.http.post(this.baseURL, evento);
  }

  // ↓ Método para receber o PUT → as informações do formulário passada por paramêtro.
  putEvento(evento: Evento) {
    /* ↓ retirado após criado o interceptador 'auth.interceptor.ts'.
      return this.http.put(`${this.baseURL}/${evento.id}`, evento, { headers: this.tokenHeader });
    */
    // Retorna um Observable.
    return this.http.put(`${this.baseURL}/${evento.id}`, evento);
  }

  // ↓ Método para deletar um item da tabela.
  deleteEvento(id: number) {
    /* ↓ retirado após criado o interceptador 'auth.interceptor.ts'.
      return this.http.delete(`${this.baseURL}/${id}`, { headers: this.tokenHeader });
    */
    // Retorna um Observable.
    return this.http.delete(`${this.baseURL}/${id}`);
  }

}
