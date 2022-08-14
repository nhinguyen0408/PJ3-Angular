import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Bill } from 'src/app/models/Bill.model';
import { API_URL } from '../../api-const.type';

interface UpdateBillType{
  billId: number,
  status: string,
  reason?: string
}
interface CreateImeiType{
  billDetailId: number,
  imei: any[]
}

@Injectable({
  providedIn: 'root'
})

export class ApiBillService {

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
  getBill():Observable<Bill>{
    return this.http.get<Bill>(this.url+"/bill/getall").pipe(
      catchError(this.handleError)
    )
  }
  getBillById(id: number):Observable<Bill>{
    return this.http.get<Bill>(this.url+"/bill/getById?billId=" + id, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  createBill(data: Bill):Observable<Bill>{
    return this.http.post<Bill>(this.url+"/bill/create", data, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  searchBill(startDate: string, endDate: string, profileId: number):Observable<Bill>{
    if(profileId == 0){
      return this.http.get<Bill>(this.url+"/bill/getall?startDate="+startDate+"&endDate="+endDate, this.httpOptions).pipe(
        catchError(this.handleError)
      )
    } else {
      return this.http.get<Bill>(this.url+"/bill/getall?startDate="+startDate+"&endDate="+endDate + "&profileId=" + profileId, this.httpOptions).pipe(
        catchError(this.handleError)
      )
    }

  }
  searchBillWarranty(phone: string):Observable<Bill>{
    return this.http.get<Bill>(this.url+"/bill/getall?phone=" + phone, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  updateStatus(data: UpdateBillType):Observable<Bill>{
    return this.http.put<any>(this.url+"/bill/updateStatus", data, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  createImei(data: CreateImeiType): Observable<any>{
    return this.http.post<any>(this.url+"/imei/create", data, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  checkImei(imei: string): Observable<any>{
    const data: any = {}
    return this.http.post<any>(this.url+"/imei/isExist?imei=" + imei,data ,this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
}
