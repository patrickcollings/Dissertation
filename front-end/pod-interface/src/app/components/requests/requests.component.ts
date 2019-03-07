import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  apps = [
    {
      name: 'Twitter',
      scopes: ['Social', 'Contacts', 'Location']
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
