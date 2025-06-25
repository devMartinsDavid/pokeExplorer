import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppLayoutComponent } from '../../shared/templates/app-layout/app-layout.component';
import { PokemonModel } from '../../core/models/pokemon.model';
import { FavoritesService } from '../../core/services/favorites.service';



import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonIcon, IonRow } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';

addIcons({
  heart
});

@Component({
  selector: 'app-favorites',
  standalone:true,
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  imports:[
    CommonModule,
    AppLayoutComponent,
    //ionic
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonIcon,
    IonButton,
    IonGrid,
    IonCol,
    IonRow
  ]
})
export class FavoritesComponent  implements OnInit {
  favorites: PokemonModel[] = [];

  constructor(private readonly favoritesService: FavoritesService) { }

  ngOnInit():void { this.loadFavorites(); }

  loadFavorites(): void { this.favorites = this.favoritesService.getFavorites(); }

  remove(pokemon: PokemonModel): void {
    this.favoritesService.toggleFavorites(pokemon);
    this.loadFavorites();
  }
}
