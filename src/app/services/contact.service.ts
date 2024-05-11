import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private http: HttpClient
  ) { }

  getContacts(page: number = 1, pageSize: number = 10, filters: any = {}): Observable<any>{
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);

    //Agregar filtros adicionales en caso de existir, para paginar con filtros activos
    Object.keys(filters).forEach(key => {
      if(filters[key]){
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(environment.api_url+'contacts', {params});
  }
}
