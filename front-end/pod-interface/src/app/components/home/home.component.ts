import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from '../../services/authorize.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthorizeService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  account() {
    console.log('My Account');
  }

  data() {
    console.log('My Data');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
