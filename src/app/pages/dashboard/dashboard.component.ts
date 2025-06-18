import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports:[ CommonModule, IonicModule, RouterModule, RouterLink ]
})
export class DashboardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
