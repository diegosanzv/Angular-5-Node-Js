import { Component } from '@angular/core';
import { Cookie } from './cookie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  getCookie(name: string) {
    return Cookie.get(name);
  }
}
