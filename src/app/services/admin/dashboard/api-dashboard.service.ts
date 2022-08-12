import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { API_URL } from '../../api-const.type';

@Injectable({
  providedIn: 'root'
})
export class ApiDashboardService {

  constructor(private http: HttpClient) { }

  url = API_URL;
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
    return throwError(err);
  }

  getAllProductSold():Observable<any>{
    return this.http.get<any>(this.url+"/ProductSold/getAll", this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  countNewBill():Observable<any>{
    return this.http.get<any>(this.url+"/bill/countNewBill", this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  getTurnOver():Observable<any>{
    return this.http.get<any>(this.url+"/bill/getTurnover", this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  getTopEmployee():Observable<any>{
    return this.http.get<any>(this.url+"/bill/getTopEmployee", this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  countNewProduct():Observable<any>{
    return this.http.get<any>(this.url+"/product/CountNewProd", this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  countNewProfile():Observable<any>{
    return this.http.get<any>(this.url+"/profile/countNewProfile", this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  countProdSold():Observable<any>{
    return this.http.get<any>(this.url+"/ProductSold/countProdSold", this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  getChart():Observable<any>{
    return this.http.get<any>(this.url+"/chart/line", this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  getChartMonth():Observable<any>{
    return this.http.get<any>(this.url+"/chart/dayOfMonth", this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  getBestEmployee():Observable<any>{
    return this.http.get<any>(this.url+"/bill/getTopEmployee?profileRole=EMPLOYEE", this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

}
