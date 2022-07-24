import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Profile } from 'src/app/models/Profile.model';
import { API_URL } from '../../api-const.type';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

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

  getProfile():Observable<Profile>{
    return this.http.get<Profile>(this.url+"/profile/getall").pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getProfileById(id:number):Observable<Profile>{
    return this.http.get<Profile>(this.url+"/profile/getById?id=" + id).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


  updateMyProfile(profile: Profile){
    return this.http.put<Profile>(this.url+'/profile/updateMyProfile', profile).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


  updatePassword({oldPass ,newPass, myId}: any):Observable<any>{
    return this.http.put(this.url+'/profile/changePass', {oldPass ,newPass, myId}).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  handleError(err: ErrorEvent) {
    let errorMessage = "";
    if(err.error instanceof ErrorEvent){
      errorMessage = err.error.error.responseMessage;
    }
    else {
      errorMessage = `Message : ${err.error.responseMessage}`
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
