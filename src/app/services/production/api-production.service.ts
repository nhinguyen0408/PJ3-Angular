import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Production } from 'src/app/models/Production.model';

@Injectable({
  providedIn: 'root'
})
export class ApiProductionService {

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
      errorMessage = `Error code : ${err} \n Message :${err.message}`
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  getProduction():Observable<Production>{
    return this.http.get<Production>(this.url+"/production/getall").pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getById(id: number):Observable<Production>{
    return this.http.get<Production>(this.url+"/production/getdetail?id=" + id).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  createProduction(production: Production):Observable<Production>{
    return this.http.post<Production>(this.url+"/production/create", production, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  editProduction(production: Production):Observable<Production>{
    return this.http.put<Production>(this.url+"/production/update", JSON.stringify(production), this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  deleteProduction(id: number):Observable<Production>{
    return this.http.delete<Production>(this.url+"/production/delete?id=" + id, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
}
