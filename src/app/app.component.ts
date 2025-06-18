import { Component } from '@angular/core';
import {IonicModule} from "@ionic/angular"
import { CommonModule } from '@angular/common';
import {IonApp, IonRouterOutlet} from "@ionic/angular";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pokeExplorer';
}
