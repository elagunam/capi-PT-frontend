import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  constructor(
    private http: HttpClient
  ) { }


  save(body: any): Observable<any>{
    return this.http.post(environment.api_url + 'phones', body);
  }

  getOneById(id: number): Observable<any>{
    return this.http.get(environment.api_url+'phones/'+id);
  }

  delete(id: number): Observable<any>{
    return this.http.delete(environment.api_url + 'phones/'+id);
  }
}
