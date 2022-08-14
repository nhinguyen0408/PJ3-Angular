import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { API_URL } from '../../api-const.type';

@Injectable({
  providedIn: 'root'
})
export class WarrantyService {

  constructor(private http: HttpClient) { }

  url = API_URL ;
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
  getBillByImei(imei: string):Observable<any>{
    return this.http.get<any>(this.url+"/bill/getall?status=COMPLETED&imei=" + imei, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  getWarrantyByPhone(phone: string):Observable<any>{
    return this.http.get<any>(this.url+"/warrantyHistory/getall?phone=" + phone, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  updateWarranty(id: string | number, data: {productCondition: string}):Observable<any>{
    return this.http.put<any>(this.url+"/warrantyHistory/update?warrantyHistoryId=" + id, data, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  createWarranty(data: any):Observable<any>{
    return this.http.post<any>(this.url+"/warrantyHistory/create", data, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
}
