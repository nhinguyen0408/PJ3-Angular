import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) { }
  url = "http://localhost:8080"
  httpOptions = {
    headers : new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      "Access-Control-Allow-Headers":'*',
      'Content-type':'application/json',
      'withCredentials': 'true'
    })
  }
  result: any;
  setToken(token: string){
    localStorage.setItem('token', token);
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

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['login']);
  }

  login({phone,password}:any):Observable<any>{
    const response= this.http.post<any>(this.url+"/profile/signin", {phone,password}, this.httpOptions).pipe(
      retry(0)
    )
    response.subscribe((res: any) => {
      this.result = res
    })
    // console.log('LOGIN RESULTS::::::::::', this.result)
    if(this.result != undefined && this.result != null){
      // console.log('LOGIN RESULT SUCCESS::::::::::', this.result)
      // console.log("this.result.token", this.result.responseData.token)
      // console.log("this.result.role", this.result.responseData.role)
      this.setToken(this.result.responseData.token);
      this.setRole(this.result.responseData.role);
      return of({name: 'Nhi Nguyen', email:'admin@gmail.com', role: this.result.responseData.role});
    }
    return of({error: 'Tên đăng nhập hoặc mật khẩu không đúng'});
  }
  handleError(err: ErrorEvent) {
    let errorMessage = "";
    if(err.error instanceof ErrorEvent){
      errorMessage = err.error.message;
    }
    else {
      errorMessage = `Error code : ${err} \n Message :${err.message}`
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
