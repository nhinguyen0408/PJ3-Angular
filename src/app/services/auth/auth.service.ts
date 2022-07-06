import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, retry, throwError } from 'rxjs';
import { Login } from 'src/app/models/Login.model';
import { API_URL } from '../api-const.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) { }
  url = API_URL
  httpOptions = {
    headers : new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      "Access-Control-Allow-Headers":'*',
      'Content-type':'application/json',
      'withCredentials': 'true'
    })
  }

  setToken(token: string){
    if(this.getToken() == null){
      localStorage.setItem('token', token);
    }
  }
  setRole(role: string){
    localStorage.setItem('role', role);
  }

  getToken(){
    return localStorage.getItem('token')
  }
  getRole(){
    return localStorage.getItem('role')
  }

  isLogedin():boolean{
    console.log("isLogedin",this.getToken())
    return this.getToken() !== null;
  }

  isUserLogedin():boolean{
    return localStorage.getItem('user-token') !== null && localStorage.getItem('user-role') ==='USER';
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('adminId');
    localStorage.removeItem('employeeId');
    console.log("this.result",this.result)
    this.router.navigate(['login']);
  }
  logoutUser(){
    localStorage.removeItem('userId');
    localStorage.removeItem('user-role');
    this.router.navigate(['user/login']);
  }
  result: any;
  login(dataLogin:Login):Observable<any>{
    return  this.http.post<Login>(this.url+"/profile/signin", dataLogin).pipe(
      retry(1)
    )
  }


  handleError(err: ErrorEvent) {
    let errorMessage = "";
    if(err.error instanceof ErrorEvent){
      errorMessage = err.error.error.message;
    }
    else {
      errorMessage = `Message : ${err.error.responseMessage}`
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
