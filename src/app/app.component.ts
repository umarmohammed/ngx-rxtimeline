import { Component } from '@angular/core';
import { deliveryData } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activities = deliveryData;
  orientation = 'Vertical';

  width = 400;
  height = 400;
}
