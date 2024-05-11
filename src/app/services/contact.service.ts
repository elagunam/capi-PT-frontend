import { HttpClient } from '@angular/common/http';
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

  getContacts(): Observable<any>{
    return this.http.get(environment.api_url+'contacts');
  }

  // activateUser(code:any): Observable<any> {
  //   return this.http.get(environment.core_url + 'auth/activate/'+code);
  // }
}
