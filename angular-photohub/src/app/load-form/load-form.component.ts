import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-load-form',
  templateUrl: './load-form.component.html',
  styleUrls: ['./load-form.component.css'],
})

export class LoadFormComponent implements OnInit {

  constructor(private httpService: HttpService) {
      console.log()
  };

  results:any = 'status';

  submit(images){
    let fd = new FormData();
    let fdFiles = [];
    for(let i: number = 0; i < images.files.length; i++) {
      fd.append('images', images.files[i]);
      fdFiles.push(images.files[i].name);
    }
    this.httpService.sendFile(fdFiles);

  }

  ngOnInit() {


  }

}
