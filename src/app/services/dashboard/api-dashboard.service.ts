import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiDashboardService {

  constructor(private http: HttpClient) { }

  url = "http://localhost:8080"
  httpOptions = {
    headers : new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      "Access-Control-Allow-Headers":'*',
      'Content-type':'application/json',
      'withCredentials': 'true'
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
    return throwError(err);
  }

  getAllProductSold():Observable<any>{
    return this.http.get<any>(this.url+"/ProductSold/getAll").pipe(
      catchError(this.handleError)
    )
  }
  countNewBill():Observable<any>{
    return this.http.get<any>(this.url+"/bill/countNewBill").pipe(
      catchError(this.handleError)
    )
  }
  getTurnOver():Observable<any>{
    return this.http.get<any>(this.url+"/bill/getTurnover").pipe(
      catchError(this.handleError)
    )
  }
  getTopEmployee():Observable<any>{
    return this.http.get<any>(this.url+"/bill/getTopEmployee").pipe(
      catchError(this.handleError)
    )
  }
  countNewProduct():Observable<any>{
    return this.http.get<any>(this.url+"/product/CountNewProd").pipe(
      catchError(this.handleError)
    )
  }
  countNewProfile():Observable<any>{
    return this.http.get<any>(this.url+"/profile/countNewProfile").pipe(
      catchError(this.handleError)
    )
  }
  countProdSold():Observable<any>{
    return this.http.get<any>(this.url+"/ProductSold/countProdSold").pipe(
      catchError(this.handleError)
    )
  }
  getChart():Observable<any>{
    return this.http.get<any>(this.url+"/chart/line").pipe(
      catchError(this.handleError)
    )
  }

}
