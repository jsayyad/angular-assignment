import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resolve} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class DataService implements Resolve<any>{
  constructor(private http: HttpClient) { }
  resolve(): Observable<any> | Promise<any> | any {
    return this.http.get(" https://jsonplaceholder.typicode.com/users");
  }
}
