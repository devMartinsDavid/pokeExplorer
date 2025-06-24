import { Component } from '@angular/core';
import { IonButtons, IonButton, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports:[
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon
  ]
})
export class HeaderComponent { }
