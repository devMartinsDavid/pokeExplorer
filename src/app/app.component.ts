import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { register } from 'swiper/element/bundle'
register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pokeExplorer';
}
