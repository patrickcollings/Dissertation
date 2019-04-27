import { Component, OnInit } from '@angular/core';
import { PodService } from 'src/app/services/pod.service';
import { AuthorizeService } from '../../services/authorize.service';

@Component({
  selector: 'app-authorized-apps',
  templateUrl: './authorized-apps.component.html',
  styleUrls: ['./authorized-apps.component.scss']
})
export class AuthorizedAppsComponent implements OnInit {

  testApp: any;

  constructor(
    private podService: PodService,
    private authService: AuthorizeService
  ) { }

  ngOnInit() {
    this.getApps();
  }

  getApps() {
    // Returns all the currently authorised applications
    this.podService.getAuthorizedApps().subscribe( res => {
      this.testApp = res;
      // Format scopes - split the string of scopes so can be displayed on front-end.
      this.testApp.forEach(app => {
        app.scope = app.scope.split(' ');
      });
    });
  }

  removeApp(client: string) {
    // Remove a client from the list of authorised applications then update the list of apps again.
    this.authService.removeApp(client).subscribe(res => {
      this.getApps();
    });
  }

  // Add fitness app to authorised apps then refresh list.
  addFitnessApp() {
    this.authService.addFitnessApp().subscribe(res => {
      this.getApps();
    });
  }

}
