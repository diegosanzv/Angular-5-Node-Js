import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgForm } from '@angular/forms';
import { Photo } from './photo';


@Injectable()
export class HttpService {

/* auth-form */
  auth (form: NgForm) {
    return this.http.post('/node', form.value);
  }

/* content */
/* POST */
  sendFile (data) {
    let fd = new FormData();
    fd = data;
    return this.http.post('/node/user', fd);
  }

/* GET */
  getImages () {
    return this.http.get('/node/user');
  }

/* PUT */
  update (updateData: any) {
    console.log(updateData)
    return this.http.put('/node/user', updateData);
  }
/* DELETE */
  delete (login: any) {
    return this.http.delete('/node/user/'+login);
  }


constructor (private http: HttpClient) { }

}
