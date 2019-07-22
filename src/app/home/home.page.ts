import { Component } from '@angular/core';

declare var TimelineMax: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  public post: any = {};
  
  constructor() {
    console.log(TimelineMax);
  }

}
