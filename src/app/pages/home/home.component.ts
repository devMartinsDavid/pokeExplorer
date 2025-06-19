import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PokemonModel } from '../../core/models/pokemon.model';
import { PokemonService } from '../../core/services/pokemon.service';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit {
  pokemons: PokemonModel[] = [];
  offset = 0;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.loadMorePokemons();
  }

  loadMorePokemons(event?: CustomEvent) {
    this.pokemonService.getPokemons(10, this.offset)
      .subscribe({
        next: (data) => {
          this.pokemons.push(...data);
          this.offset += data.length;

          if (event?.target) {
            (event.target as any).complete();
          }
        },
        error: (err) => {
          console.error('Erro ao carregar pokémons', err);
          if (event?.target) {
            (event.target as any).complete();
          }
        }
      });
  }

}
