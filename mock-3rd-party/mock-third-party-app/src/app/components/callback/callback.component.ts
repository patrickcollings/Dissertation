import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizeService } from '../../services/authorize.service';

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
    // Get parameters from URL
    this.activatedRoute.queryParams.subscribe(params => {
      // Check if states match
      if (this.authService.checkState(params.state)) {
        this.state = 'States match.';
        this.code = params.code;
        this.scope = params.scope;
        // Get access token from authentication server using auth code
        this.authService.getAccessToken(this.code, this.scope).subscribe( res => {
          this.token = res.access_token;
        });
      }
    });
  }

  // Search for a value in the pod by key.
  getData() {
    const search = this.key;
    this.dataService.getHealthData(this.token, search).subscribe( res => {
      // If key found then display value
      if (res[`${search}`]) {
        this.data = res[`${search}`];
      } else {
        this.data = 'Not found';
      }
    },
    error => {
      this.data = error.error.msg;
    });
  }

  // Add or update data in the pod.
  addData() {
    this.dataService.addHealthData(this.token, this.writeKey, this.writeValue).subscribe( res => {
      if (res[`success`]) {
        this.writeData = 'Value successfully updated';
      } else {
        this.writeData = 'Error';
      }
    },
    error => {
      this.writeData = error.error.err.msg;
    });
  }

  // Delete a key-value pair in the pod.
  deleteData() {
    this.dataService.deleteHealthData(this.token, this.deleteKey).subscribe(
    (res) => {
      this.deleteResponse = res[`msg`];
    },
    error => {
      this.deleteResponse = error.error.msg;
    });
  }

  authorise() {
    window.open('http://localhost:4200', '_self');
  }
}
