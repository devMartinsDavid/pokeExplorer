import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/angular/standalone';
import { PokemonModel } from '../../../core/models/pokemon.model';

import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
addIcons({
  'heart': heart,
  'heart-outline': heartOutline
});

@Component({
  selector: 'pokemon-card',
  standalone: true,
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonIcon
  ]
})
export class PokemonCardComponent {
  @Input({ required: true }) pokemon!: PokemonModel;
  @Output() liked = new EventEmitter<PokemonModel>();
  @Output() openDetails = new EventEmitter<number>();

  constructor() { }

  toggleLike() { this.liked.emit(this.pokemon); }

  showDetails() { this.openDetails.emit(this.pokemon.id); }

}
