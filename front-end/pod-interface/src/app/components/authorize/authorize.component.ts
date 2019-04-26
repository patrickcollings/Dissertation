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
      // Get list of URL parameters from the request. This will be used to generate an auth code.
      this.clientId = params.client_id;
      this.redirect = params.redirect_uri;
      this.responseType = params.response_type;
      this.scope = params.scope;
      this.state = params.state;

      this.redirect.trim();
    });
  }

  ngOnInit() {
  }

  // If user accepts the request then generate new auth code from the auth service.
  accept() {
    this.authService.getCode(this.redirect, this.clientId, this.scope).subscribe(res => {
      // Generate new URI to the redirect location and include the new auth code.
      const url = this.redirect + `?code=${res}&state=${this.state}&scope=${this.scope}`;
      const uri = encodeURI(url);
      // Open new window back to the third-party.
      window.open(uri, '_self');
    });
  }

  // If user rejects the request then they are taken back to the third-party with no auth code.
  reject() {
    window.open('http://localhost:4200', '_self');
  }
}
