import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { API_URL } from '../../api-const.type';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  url = API_URL
  token: any = localStorage.getItem('token') ? localStorage.getItem('token') : '' ;
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
  getAllNotification():Observable<any>{
    return this.http.get<any>(this.url+"/notif/getAll", this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  readNotification(id: number | string):Observable<any>{
    return this.http.get<any>(this.url+"/notif/readNotification?id=" + id, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  countUnReadNotification():Observable<any>{
    return this.http.get<any>(this.url+"/notif/countUnread", this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

}
