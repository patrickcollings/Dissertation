import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from '../../services/authorize.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  error = false;
  errorMessage = '';

  returnUrl: string;

  constructor(
    private authorizeService: AuthorizeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
   }

  ngOnInit() {
  }

  submit() {
    console.log('Logging in- ' + this.username + ' : ' + this.password);
    // Attempt to login with user credentials. If error display message.
    this.authorizeService.login(this.username, this.password).subscribe(
      result => {
        // If correct then navigate to the either the home page for the pod or the authorisation page for a request.
        this.router.navigateByUrl(this.returnUrl);
      },
      err => {
        this.errorMessage = 'Error Authenticating User - Try Again';
        this.error = true;
      }
    );
  }

}
