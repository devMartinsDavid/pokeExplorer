import { Component, OnInit } from '@angular/core';
import { AppLayoutComponent } from '../../shared/templates/app-layout/app-layout.component';

@Component({
  selector: 'app-favorites',
  standalone:true,
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  imports:[
    AppLayoutComponent
  ]
})
export class FavoritesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
