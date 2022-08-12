import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { API_URL } from '../../api-const.type';

interface UpdateBillType{
  billId: number | null,
  status: string,
  reason?: string
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  url = API_URL
  token: any = localStorage.getItem('user-token') ? localStorage.getItem('user-token') : '' ;
  httpOptions = {
    headers : new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      "Access-Control-Allow-Headers":'*',
      'Content-type':'application/json',
      'withCredentials': 'true',
      "Accept-Token": this.token
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
  getMyOrder(userId: number):Observable<any>{
    return this.http.get<any>(this.url+"/bill/getall?profileId=" + userId, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  getOrderDetails( id: number):Observable<any>{
    return this.http.get<any>(this.url+"/bill/getById?billId=" + id, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  updateStatus(data: UpdateBillType):Observable<any>{
    return this.http.put<any>(this.url+"/bill/updateStatus", data, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
}
