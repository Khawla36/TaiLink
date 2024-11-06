import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class userService {
  private apiUrl = "http://localhost:3000/api"
  constructor(private http:HttpClient){}

  addUser(user: User):Observable<User>{
    return this.http.post<User>(`${this.apiUrl}/person`, user)
   }

  getUsers():Observable<User[]>{//this is for the list of people(table)
    return this.http.get<User[]>(`${this.apiUrl}/persons`)
  }
  
 
}
