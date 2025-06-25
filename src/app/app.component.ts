import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { register } from 'swiper/element/bundle'
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { Observable } from 'rxjs';
import { LoadingService } from './core/services/loading.service';
register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet,
    SpinnerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
 title = 'pokeExplorer';
 isLoading$:Observable<boolean>;

  constructor(private loadingService: LoadingService) { this.isLoading$ = this.loadingService.loading$; }

  ngOnInit() { this.loadingService.show(); }

  ngAfterViewInit(): void { this.loadingService.hide(); }

}
