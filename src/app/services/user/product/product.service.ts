import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Product } from 'src/app/models/Product.model';
import { API_URL } from '../../api-const.type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  url = API_URL;
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
    return throwError(errorMessage);
  }
  getProductEnable():Observable<Product>{
    return this.http.get<Product>(this.url+"/product/getall?getall=false&status=ACTIVE", this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  searchProduct(code: string, idCate: number, idProduction: number, name: string, status: string):Observable<Product>{
    if(code === ''){
      const url = this.url+"/product/getall?idCate="+ idCate +"&idProduction="+ idProduction +"&name=" + name + '&status='+status;
      return this.http.get<Product>(url).pipe(
        retry(1),
      )
    }

    const url = this.url+"/product/getall?code="+code+"&idCate="+ idCate +"&idProduction="+ idProduction +"&name=" + name + '&status='+status;
    console.log("url has code",url);
    return this.http.get<Product>(url, this.httpOptions).pipe(
      retry(1),
    )
  }
  getById(id: number):Observable<Product>{
    return this.http.get<Product>(this.url+"/product/getdetail?id=" + id, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
}
