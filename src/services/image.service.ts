import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}

  public uploadImage(formData): Observable<any> {
    console.log(formData);

    return this.http.post('https://mediauploaduat.oyespace.com/oyeliving/api/V1/association/upload', formData);
  }}
