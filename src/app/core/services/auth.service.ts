import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { UserModel } from '../models/user.model';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly URL = environment.apiAuth;
  private readonly token$: BehaviorSubject<any> = new BehaviorSubject( {} as any);
  public readonly currentToken: Observable<any> = this.token$.asObservable();

  constructor(private httpClient:HttpClient, 
              private router:Router, 
             ) { }

  login (loginModel:LoginModel){
    
    this.httpClient.post <string>(`${this.URL}/login`,loginModel).subscribe(receivedItem => {
      
      localStorage.setItem('access_token',JSON.stringify(receivedItem));

      this.goAdminPage();
            
    },err => {
            
        if(err.status===401){
          this.token$.next("401");
          
        }
          
      }
    )
  }

  logout() {

    localStorage.clear();
    this.goLoginPage();
  }


  isLoggedIn() { 

    if(localStorage.getItem('access_token')!=null)
      return true;
    else
      return false;
  }

  getToken(){
    const userStorage = localStorage.getItem('access_token');
    return JSON.parse(userStorage!).access_token;
  }

  goAdminPage(){
    this.router.navigate(['/admin']);
  }

  private goLoginPage(){
    this.router.navigate(['/auth/login']);
  }

  register(user:UserModel){

    return this.httpClient.post(`${this.URL}/register`,user,{observe: 'response', responseType: 'json'});

  }

}
