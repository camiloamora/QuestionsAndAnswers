import { Injectable } from '@angular/core';
import urljoin from 'url-join'
import { environment } from '../../environments/environment';
import { User } from './user.model';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable()

export class AuthService {
  usersUrl: string;
  currentUser?: User;

  constructor(private http: Http, private router: Router){
    this.usersUrl = urljoin(environment.apiUrl, 'auth');
    if(this.isLoggedIn()){
      const { userId, email, firstName, lastName } = JSON.parse(localStorage.getItem('userId'));
      this.currentUser = new User(email, null, firstName, lastName, userId);
    }
  }

  signin(user: User){
    const body = JSON.stringify(user);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(urljoin(this.usersUrl, 'signin'), body, { headers })
    .map((response: Response) => {
        const json = response.json();
        this.login(json);
        return json;
      })
      .catch((error: Response) => {
        console.log(error);
        throw Observable.throw(error.json());
      })
  }

  login = ({ token, userId, firstName, lastName, email }) => {
    this.currentUser =new User(email, null, firstName, lastName, userId);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ userId, firstName, lastName, email }));
    this.router.navigateByUrl('/');
  }

  isLoggedIn()
  {
    return localStorage.getItem('token') !== null;
  }
}
