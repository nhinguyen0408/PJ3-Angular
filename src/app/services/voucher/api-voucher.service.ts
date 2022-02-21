import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Voucher } from 'src/app/models/Voucher.model';

@Injectable({
  providedIn: 'root'
})
export class ApiVoucherService {

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
  getVoucher():Observable<Voucher>{
    return this.http.get<Voucher>(this.url+"/voucher/getall").pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getVoucherById(id: number):Observable<Voucher>{
    return this.http.get<Voucher>(this.url+"/voucher/getById?id=" + id).pipe(
      catchError(this.handleError)
    )
  }
  getVoucherByKey(key: string):Observable<Voucher>{
    return this.http.get<Voucher>(this.url+"/voucher/getByKey?key=" + key).pipe(

    )
  }

  createVoucher(data: Voucher):Observable<Voucher>{
    return this.http.post<Voucher>(this.url+"/voucher/create", data).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  updateVoucher(data: Voucher):Observable<Voucher>{
    return this.http.put<Voucher>(this.url+"/voucher/update", data).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  deleteVoucher(id:number):Observable<any>{
    return this.http.delete(this.url+"/voucher/delete?id=" + id).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
}
