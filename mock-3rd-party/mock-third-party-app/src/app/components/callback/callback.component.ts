import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizeService } from '../../services/authorize.service';

import { take } from 'rxjs/operators';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  state: string;
  code: string;
  token: string;
  scope: string;

  key: string;
  data: any;

  writeKey: string;
  writeValue: string;
  writeData: any;

  deleteKey: string;
  deleteResponse: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthorizeService,
    private dataService: DataService
  ) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params); // Print the parameter to the console.
      if (this.authService.checkState(params.state)) {
        this.state = 'States are correct!: ' + params.state;
        this.code = params.code;
        this.scope = params.scope;
        // Get access token from authentication server
        this.authService.getAccessToken(this.code, this.scope).subscribe( res => {
          this.token = res.access_token;
        });
      }
    });
  }

  getData() {
    const search = this.key;
    this.dataService.getHealthData(this.token, search).subscribe( res => {
      console.log(res);
      this.data = res;
    },
    error => {
      this.data = error.error;
    });
  }

  addData() {
    this.dataService.addHealthData(this.token, this.writeKey, this.writeValue).subscribe( res => {
      this.writeData = res;
    },
    error => {
      this.writeData = error.error;
    });
  }

  deleteData() {
    this.dataService.deleteHealthData(this.token, this.deleteKey).subscribe(
    (res) => {
      this.deleteResponse = res;
    },
    error => {
      console.log(error);
      this.deleteResponse = error.error;
    });
  }
}
