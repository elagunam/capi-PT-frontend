import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(
    private http: HttpClient
  ) { }


  save(body: any): Observable<any>{
    return this.http.post(environment.api_url + 'address', body);
  }

  getOneById(id: number): Observable<any>{
    return this.http.get(environment.api_url+'address/'+id);
  }
}
