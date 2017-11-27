import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoadFormComponent } from './load-form/load-form.component';
import { ContentComponent } from './content/content.component';
import { HttpService } from './http.service';
import { AuthFormComponent } from './auth-form/auth-form.component';


@NgModule({
  declarations: [
    AppComponent,
    LoadFormComponent,
    ContentComponent,
    AuthFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
