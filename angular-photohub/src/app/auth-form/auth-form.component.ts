import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService} from '../http.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit {
status = '';
authColor:string= 'white';

submit (form: NgForm, button) {
  this.status = 'Please wait...';
  let green: string = '#e2f7df'
  this.authColor = green;
  button.disabled = true;

  this.httpService.auth(form).subscribe(
    (data) => {
      console.log(data);
    },
    error => {
      this.status = error.error;
      console.log(error.error);
      button.disabled = false;
      let red: string = '#ffcccc';
      this.authColor=red;
    }
  );
}

setStyles () {
  let styles = {
    'background-color': this.authColor
  };
  return styles;
}

  constructor (private httpService: HttpService) {}



  ngOnInit(){}


}
