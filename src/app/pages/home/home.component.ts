import { Component, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../core/services/pokemon.service';
import { PokemonModel } from '../../core/models/pokemon.model';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
Swiper.use([Navigation, Pagination]);

import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { AppLayoutComponent } from '../../shared/templates/app-layout/app-layout.component';

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
    AppLayoutComponent

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class HomeComponent implements OnInit {
  @ViewChild('swiperEx', { static: false }) swiperEx?: ElementRef<HTMLDivElement>;

  pokemons: PokemonModel[] = [];
  offset = 0;
  limit = 10;
  currentIndex = 0;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() { this.loadPokemons(true); }

  get swiper(): any {
    return (this.swiperEx?.nativeElement as any)?.swiper;
  }

  slideNext() { this.swiper?.slideNext(); }

  slidePrev() { this.swiper?.slidePrev(); }

  loadPokemons(useCache = false) {
    this.pokemonService.loadPokemons({ limit: this.limit, offset: this.offset, useCache }).subscribe({
      next: (data) => {
        if (this.offset === 0) { this.pokemons = data; }
        else { this.pokemons = [...this.pokemons, ...data]; }

        this.offset += data.length;
      },
      error: (err) => { console.error('Erro ao carregar pokemons:', err); },
    });
  }

  onSlideChange() {
    if (!this.swiper) return;
    this.currentIndex = this.swiper.realIndex;
    const buffer = 5;

    if (this.currentIndex + buffer >= this.pokemons.length) { this.loadPokemons(); }
  }

  loadNextPage() {
    this.pokemonService.loadPokemons({ limit: 10, offset: this.offset }).subscribe((data) => {
      this.pokemons = [...this.pokemons, ...data];
      this.offset += data.length;
      localStorage.setItem('pokemons', JSON.stringify(this.pokemons));
    });
  }
}
