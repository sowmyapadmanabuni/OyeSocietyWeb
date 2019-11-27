import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginAndregisterService {
  toggleloggin:boolean;
  toggleregister:boolean;
  toggleMyMenus: boolean;

  constructor() {
    this.toggleloggin=true;
    this.toggleregister=false;
    this.toggleMyMenus=false;
   }
}
