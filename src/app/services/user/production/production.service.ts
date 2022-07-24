import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Production } from 'src/app/models/Production.model';
import { API_URL } from '../../api-const.type';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  constructor(private http: HttpClient) { }

  url = API_URL
  token: any = localStorage.getItem('user-token') ? localStorage.getItem('user-token') : '' ;
  httpOptions = {
    headers : new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      "Access-Control-Allow-Headers":'*',
      'Content-type':'application/json',
      'withCredentials': 'true',
      'Accept-Token': this.token
    })
  }

  handleError(err: ErrorEvent) {
    let errorMessage = "";
    if(err.error instanceof ErrorEvent){
      errorMessage = err.error.message;
    }
    else {
      errorMessage = `Message : ${err.error.responseMessage}`
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  getProduction():Observable<Production>{
    return this.http.get<Production>(this.url+"/production/getall", this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getProductionEnable():Observable<Production>{
    return this.http.get<Production>(this.url+"/production/getall?status=ENABLE", this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getById(id: number):Observable<Production>{
    return this.http.get<Production>(this.url+"/production/getdetail?id=" + id, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

}
