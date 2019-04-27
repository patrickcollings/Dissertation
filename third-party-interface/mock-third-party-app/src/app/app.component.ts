import { Component } from '@angular/core';
import { AuthorizeService } from './services/authorize.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mock-third-party-app';

  constructor(
    private authService: AuthorizeService
  ) {

  }
}
