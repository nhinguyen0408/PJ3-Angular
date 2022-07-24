import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Category } from 'src/app/models/Category.model';
import { API_URL } from '../../api-const.type';
import { ToastService } from '../../toasts-alert/toast.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private toastsService: ToastService) { }

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
    this.toastsService.alert("Thông báo!!!!",errorMessage, 'bg-danger')
    return throwError(err);
  }
  getCategory():Observable<Category>{
    return this.http.get<Category>(this.url+"/category/getall", this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getCategoryEnable():Observable<Category>{
    return this.http.get<Category>(this.url+"/category/getall?status=ENABLE", this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  getById(id: number):Observable<Category>{
    return this.http.get<Category>(this.url+"/category/getdetail?id=" + id, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
}
