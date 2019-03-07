import { Component, OnInit } from '@angular/core';
import { PodService } from 'src/app/services/pod.service';
import { AuthorizeService } from '../../services/authorize.service';

@Component({
  selector: 'app-authorized-apps',
  templateUrl: './authorized-apps.component.html',
  styleUrls: ['./authorized-apps.component.scss']
})
export class AuthorizedAppsComponent implements OnInit {

  apps = [
    {
      name: 'Facebook',
      scopes: ['Social', 'Health', 'Contacts', 'Facebook']
    },
    {
      name: 'Snapchat',
      scopes: ['Snapchat', 'Location']
    }
  ];

  testApp: any;

  constructor(
    private podService: PodService,
    private authService: AuthorizeService
  ) { }

  ngOnInit() {
    this.getApps();
  }

  getApps() {
    this.podService.getAuthorizedApps().subscribe( res => {
      console.log(res);
      this.testApp = res;
      console.log(this.testApp);
      // Format scopes
      this.testApp.forEach(app => {
        app.scope = app.scope.split(' ');
      });
      console.log(this.testApp);
    });
  }

  removeApp(client: string) {
    this.authService.removeApp(client).subscribe(res => {
      console.log(res);
      this.getApps();
    });
  }

}
