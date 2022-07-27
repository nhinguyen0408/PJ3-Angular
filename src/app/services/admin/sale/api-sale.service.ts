import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Sale } from 'src/app/models/Sale.model';
import { API_URL } from '../../api-const.type';

@Injectable({
  providedIn: 'root'
})
export class ApiSaleService {

  constructor(private http: HttpClient) { }

  url = API_URL
  token: any = localStorage.getItem('token') ? localStorage.getItem('token') : '' ;
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
  getSale():Observable<Sale>{
    return this.http.get<Sale>(this.url+"/sale/getAll", this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  getById(id: number):Observable<Sale>{
    return this.http.get<Sale>(this.url+"/sale/getDetail?productId=" + id, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  upSertSale(sale: any):Observable<any>{
    return this.http.post<any>(this.url+"/sale/create", sale, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }


  deleteSale(id: number):Observable<any>{
    return this.http.delete<any>(this.url+"/sale/delete?id=" + id, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
}
