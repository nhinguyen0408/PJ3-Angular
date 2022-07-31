import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { CartUser } from 'src/app/models/CartUser.model';
import { API_URL } from '../../api-const.type';

@Injectable({
  providedIn: 'root'
})
export class CartService {

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

  getDataCart():Observable<CartUser>{
    return this.http.get<CartUser>(this.url+"/user/shoppingCart/detail", this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  addToCart(productId: number, quantity: number):Observable<any>{
    const a: any = {};
    return this.http.post(this.url+"/user/shoppingCart/add?productId="+productId+"&quantity="+quantity, a, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  removeToCart(productId: number, quantity: number):Observable<any>{
    const a: any = {};
    return this.http.post<any>(this.url+"/user/shoppingCart/remove?productId="+productId+"&quantity="+quantity, a, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
}
