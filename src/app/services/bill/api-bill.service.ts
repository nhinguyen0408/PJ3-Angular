import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Bill } from 'src/app/models/Bill.model';

@Injectable({
  providedIn: 'root'
})
export class ApiBillService {

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
  getBill():Observable<Bill>{
    return this.http.get<Bill>(this.url+"/bill/getall").pipe(
      catchError(this.handleError)
    )
  }
  getBillById(id: number):Observable<Bill>{
    return this.http.get<Bill>(this.url+"/bill/getById?billId=" + id).pipe(
      catchError(this.handleError)
    )
  }

  createBill(data: Bill):Observable<Bill>{
    return this.http.post<Bill>(this.url+"/bill/create", data, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  searchBill(startDate: string, endDate: string):Observable<Bill>{
    return this.http.get<Bill>(this.url+"/bill/getall?startDate="+startDate+"&endDate="+endDate).pipe(
      catchError(this.handleError)
    )
  }
}
