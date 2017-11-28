import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { HttpService } from '../http.service';
import { Photo } from '../photo';

import { Cookie } from '../cookie';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit {
  loginForEdit: string;
  adata: any;
  login: string;
  admin: boolean;
  images : Photo[];
  editFormStatus: string;
  loadFormStatus: string;

  logout() {
    this.login = Cookie.deleteCookie();
  }

 checkUser (userData) {
   this.loginForEdit = userData.login;
   this.images = userData.images as Photo[];
 }

 resetEdit() {
     this.loginForEdit = null;
     this.images = null;
 }

  constructor( private httpService: HttpService ) {
    this.images = null;
   }


  ngOnInit() {
    this.getUserList ();
    this.loginForEdit = null;
  }

  /* get */

  getUserList () {
    this.httpService.getImages().subscribe((result:any) => {
      this.login = result.login as string;
      this.admin = result.admin as boolean;
      if(!this.images){
        this.images= result.images;
      }
      this.adata = result.data;
    });
  }

  /* post */
  submitLoad (newUserName, newUserPassword, inputImages, button) {
    button.disabled = true;
    let fd = new FormData();
    fd.append('userName', newUserName.value);
    fd.append('userPassword', newUserPassword.value);

    for(let i: number = 0; i < inputImages.files.length; i++) {
      fd.append('images', inputImages.files[i]);
    }

    this.httpService.sendFile(fd).subscribe(
      (data:any) => {
        this.getUserList();
        this.images = data.images;
        this.loginForEdit = data.login as string;
        button.disabled = false;
        this.loadFormStatus= 'OK';

      },
      error => {
        button.disabled = false;
        this.loadFormStatus= error;
        console.log(error);
      }
    );
  }

  /* put */
  updateUser (newLogin, newPassword, button) {     //error!
    button.disabled = true;
    let updateData;
    if (newLogin===null) {
      updateData = {
        "images": this.images,
        "login": this.loginForEdit
      };
    } else {
      updateData = {
        "login": this.loginForEdit,
        "newLogin": newLogin.value,
        "newPassword": newPassword.value
      };
    }

    this.httpService.update(updateData).subscribe(
      (error) => {

      },
      (result) => {
        button.disabled = false;
        this.getUserList ();
        console.log(result);
      }
    );
    this.images= null;
    this.loginForEdit= null;
  }

  /* delete */
  delete (login, button) {
    this.httpService.delete(login).subscribe((result:any) => {
      this.getUserList();
      this.images = null;
    });
  }
}
