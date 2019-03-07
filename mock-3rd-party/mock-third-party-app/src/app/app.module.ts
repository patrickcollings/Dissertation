import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthorizeService } from './services/authorize.service';
import { DataService } from './services/data.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CallbackComponent } from './components/callback/callback.component';
import { RequestComponent } from './components/request/request.component';

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    RequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthorizeService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
