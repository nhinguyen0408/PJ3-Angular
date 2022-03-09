import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, retry, throwError } from 'rxjs';
import { Login } from 'src/app/models/Login.model';

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

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('adminId');
    console.log("this.result",this.result)
    this.router.navigate(['login']);
  }
  result: any;
  login(dataLogin:Login):Observable<any>{
    return  this.http.post<Login>(this.url+"/profile/signin", dataLogin).pipe(
      retry(1)
    )
    // response.subscribe((res: any) => {
    //   console.log(" this.result",res)
    //   if(res.responseMessage === "SUCCESS"){
    //     this.setToken(res.responseData.token);
    //     this.setRole(res.responseData.role);
    //   }
    // })
    // if(this.result.responseMessage === "SUCCESS"){
    //   // console.log('LOGIN RESULT SUCCESS::::::::::', this.result)
    //   console.log("this.result.token", this.result.responseData.token)
    //   // console.log("this.result.role", this.result.responseData.role)

    //   return of(this.result.responseData.profile);
    // }
    // return of({error: 'Tên đăng nhập hoặc mật khẩu không đúng'});
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
