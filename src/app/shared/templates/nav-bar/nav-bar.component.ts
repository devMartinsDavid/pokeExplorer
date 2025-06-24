import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonTabButton, IonIcon, IonTabBar, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, colorPaletteOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';

addIcons({
  'home-outline': homeOutline,
  'heart-outline': heartOutline,
  'color-palette-outline': colorPaletteOutline
});

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports:[
    RouterLink,
    RouterLinkActive,
    //ionic
    IonTabBar,
    IonLabel,
    IonIcon,
    IonTabButton,

  ]
})
export class NavBarComponent implements OnInit {
  private routerSub?: Subscription;

  constructor(private router: Router){}

  ngOnInit() {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) { const activeEl = document.activeElement as HTMLElement | null;
        if (activeEl && typeof activeEl.blur === 'function') { activeEl.blur(); }
      }
    });
  }

 }
