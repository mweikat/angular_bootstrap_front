import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { UserModel } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly URL = environment.apiAuth;
  //private readonly token$: BehaviorSubject<any> = new BehaviorSubject( {} as any);
  //public readonly currentToken: Observable<any> = this.token$.asObservable();
  private readonly msg$: Subject<any> = new Subject();
  public readonly currentLoginMsg: Observable<any> = this.msg$.asObservable();

  constructor(private httpClient:HttpClient, 
              private router:Router, 
             ) { }

  login (loginModel:LoginModel){
    
    this.httpClient.post <string>(`${this.URL}/login`,loginModel).subscribe(receivedItem => {
      
      localStorage.setItem('access_token',JSON.stringify(receivedItem));

      this.goAdminPage();
            
    },err => {
            
        this.msg$.next(err.error);
            
      }
    )
  }

  logout() {

    localStorage.clear();
    this.goLoginPage();
  }


  isLoggedIn() { 

    if(localStorage.getItem('access_token')!=null){
      this.goAdminPage();
    }
  }

  getToken(){
    const userStorage = localStorage.getItem('access_token');
    return JSON.parse(userStorage!).access_token;
  }

  private goAdminPage(){
    this.router.navigate(['/admin']);
  }

  register(user:UserModel){

    return this.httpClient.post(`${this.URL}/register`,user,{observe: 'response', responseType: 'json'});

  }

  private goLoginPage(){
    this.router.navigate(['/auth/login']);
  }

}
