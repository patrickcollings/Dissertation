import { Component, OnInit } from '@angular/core';
import { PodService } from '../../services/pod.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  pairs = [];

  constructor(
    private podService: PodService
  ) { }

  ngOnInit() {
    // Get all of the data from a users collection
    this.podService.getData().subscribe(data => {
      console.log(data);
      // Get keys
      const keys = Object.keys(data);
      // For each key remove unnecessary values and push to array
      keys.forEach(key => {
        const pair = data[key];
        delete pair[`__v`];
        delete pair[`_id`];
        const pairkey = Object.keys(pair);
        const temp = {
          key: pairkey[0],
          value: pair[pairkey[0]]
        };
        this.pairs.push(temp);
      });
    });

  }

}
