import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizeService } from '../../services/authorize.service';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {

  clientId: string;
  redirect: string;
  responseType: string;
  scope: string;
  state: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthorizeService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params); // Print the parameter to the console.
      this.clientId = params.client_id;
      this.redirect = params.redirect_uri;
      this.responseType = params.response_type;
      this.scope = params.scope;
      this.state = params.state;
    });
  }

  ngOnInit() {
  }

  accept() {
    this.authService.getCode(this.redirect, this.clientId, this.scope).subscribe(res => {
      console.log(this.redirect);
      const uri = encodeURI(this.redirect + `?code=${res}&state=${this.state}&scope=${this.scope}`);
      window.open(uri, '_self');
    });
  }

  reject() {
    console.log('Rejecting Request');
  }
}
