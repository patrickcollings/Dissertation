import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from '../../services/authorize.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  readPermission = false;
  writePermission = false;
  deletePermission = false;

  constructor(
    private authService: AuthorizeService
  ) { }

  ngOnInit() {
  }

  authorize() {
    this.authService.getPermission(this.readPermission, this.writePermission, this.deletePermission);
  }

}
