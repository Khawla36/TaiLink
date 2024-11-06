import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../models/address';
import { HttpClient } from '@angular/common/http';
import { Country } from '../models/country';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = "http://localhost:3000/api" 
  constructor(private http:HttpClient){}

  getCountries():Observable<Country[]>{
    return this.http.get<Country[]>(`${this.apiUrl}/countries`)
  }

  addCity(city: {name:string,countryId:number}):Observable<City>{
    return this.http.post<City>(`${this.apiUrl}/city`, city)
   }

  getCitiesByCountryId(countryId:number):Observable<City[]>{
    return this.http.get<City[]>(`${this.apiUrl}/cities/${countryId}`)
  }
}
