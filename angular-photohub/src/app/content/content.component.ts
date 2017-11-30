import { Component, OnInit, ElementRef } from '@angular/core';
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
  images : any;
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

  constructor( private elt:ElementRef, private httpService: HttpService ) {
    this.images = null;
   }


  ngOnInit() {
    this.getUserList ();
    this.loginForEdit = null;
  }

deleteImg(image, button) {
  if (this.images.length === 1) {return;}
  let newImages = [];
  this.images.forEach((item) => {
    if(image !== item){
      newImages.push(item);
    }
  });
  this.images = newImages;
  this.updateUser(null, null, button);
}

  /* get */

  getUserList () {
    this.httpService.getImages().subscribe(
      (result:any) => {
        this.login = result.login as string;
        this.admin = result.admin as boolean;
        if(!this.images){
          this.images= result.images;
        }
        this.adata = result.data;
    },
    (error: any) => {
        console.log('that looks bad: '+error.error);
        this.logout();
    });
  }

  /* post */
  submitLoad (newUserName, newUserPassword, inputImages, button, loadForm) {
    button.disabled = true;
    let fd = new FormData();
    fd.append('userName', newUserName.value.toLowerCase());
    fd.append('userPassword', newUserPassword.value);

    for(let i: number = 0; i < inputImages.files.length; i++) {
      fd.append('images', inputImages.files[i]);
      console.log(inputImages.files[i])
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
        this.loadFormStatus= error.error as string;
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
        "newLogin": newLogin.value.toLowerCase(),
        "newPassword": newPassword.value
      };
      this.loginForEdit = newLogin.value;
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
  }

  /* delete */
  delete (login, button) {
    this.httpService.delete(login).subscribe((result:any) => {
      this.getUserList();
      this.images = null;
    });
  }
}
