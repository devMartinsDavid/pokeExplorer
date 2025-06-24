import { Component, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
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
  IonSearchbar
} from '@ionic/angular/standalone';
import { AppLayoutComponent } from '../../shared/templates/app-layout/app-layout.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    //ionic
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
    IonSearchbar,
    AppLayoutComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, AfterViewInit  {
  @ViewChild('swiperEx', { static: false }) private swiperEx?: ElementRef<HTMLDivElement>;

  pokemons: PokemonModel[] = [];
  private offset = 0;
  private readonly limit = 10;
  isLoading = false;
  allPokemonList: { name: string; url: string }[] = [];
  searchTerm = '';
  suggestions: { name: string; url: string }[] = [];

  constructor(private readonly pokemonService: PokemonService) {
   }

  ngOnInit(): void {
    this.pokemonService.getAllPokemonNames().subscribe({ next: (list) => this.allPokemonList = list });
    this.loadMorePokemons();
  }

  ngAfterViewInit(): void {
    // Lifecycle hook, kept for possible future use
  }

  get swiper(): any {
    return (this.swiperEx?.nativeElement as any)?.swiper;
  }

  // Called on slide change event
  onSlideChange(): void {
    const currentIndex = this.swiper?.realIndex ?? 0;
    const buffer = 5;

    if (currentIndex + buffer >= this.pokemons.length && !this.isLoading) { this.loadMorePokemons(); }
  }

  // Loads more pokemons and updates swiper
  private loadMorePokemons(): void {
    this.isLoading = true;

    this.pokemonService.loadPokemons(this.offset, this.limit).subscribe({
      next: (newPokemons) => {
        this.pokemons = [...this.pokemons, ...newPokemons];
        this.offset += newPokemons.length;
        this.isLoading = false;

        setTimeout(() => {
          this.swiper?.update(); // Update swiper after DOM changes
        }, 100);
      },
      error: () => { this.isLoading = false; },
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.suggestions = term.length >= 2
      ? this.allPokemonList.filter(p => p.name.includes(term)).slice(0, 10)
      : [];
  }

  goToPokemon(suggestion: { name: string; url: string }): void {
    const alreadyLoaded = this.pokemons.find(p => p.name === suggestion.name);

    if (alreadyLoaded) {
      const index = this.pokemons.findIndex(p => p.name === suggestion.name);
      this.swiper?.slideTo(index);
      this.clearSearch();
      return;
    }

    // Load from API
    this.pokemonService.fetchPokemonDetails(suggestion.url).subscribe({
      next: (newPoke) => {
        this.pokemons.push(newPoke);
        setTimeout(() => {
          this.swiper?.update();
          const newIndex = this.pokemons.length - 1;
          this.swiper?.slideTo(newIndex);
        }, 100);
        this.clearSearch();
      }
    });
  }

  private clearSearch(): void {
    this.searchTerm = '';
    this.suggestions = [];
  }
}
