import { Component, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../core/services/pokemon.service';
import { PokemonModel } from '../../core/models/pokemon.model';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
Swiper.use([Navigation, Pagination]);

import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

addIcons({
  'heart': heart,
  'heart-outline': heartOutline
});

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
  IonSearchbar,
  IonSpinner,
  ViewWillEnter,
  ModalController
} from '@ionic/angular/standalone';
import { AppLayoutComponent } from '../../shared/templates/app-layout/app-layout.component';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { FavoritesService } from '../../core/services/favorites.service';
import { DetailsComponent } from '../details/details.component';

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
    IonSpinner,
    //components
    AppLayoutComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, AfterViewInit, ViewWillEnter {
  @ViewChild('swiperEx', { static: false }) private swiperEx?: ElementRef<HTMLDivElement>;

  pokemons: PokemonModel[] = [];
  private offset = 0;
  private readonly limit = 10;
  isLoading = false;
  isLoadingSuggestions = false;
  message ='';
  searchTerm = '';
  allPokemonList: { name: string; url: string }[] = [];
  suggestions: { name: string; url: string }[] = [];



  constructor(
    private readonly pokemonService: PokemonService,
    private readonly favoritesService: FavoritesService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit(): void {
    // localStorage.clear();
    this.pokemonService.getAllPokemonNames().subscribe({ next: (list) => this.allPokemonList = list });
    this.loadMorePokemons();
  }

  ngAfterViewInit(): void {
    // Lifecycle hook, kept for possible future use
  }

  ionViewWillEnter(): void {
    const savedFavorites = this.favoritesService.getFavorites();
    this.pokemons.forEach(p => {
      p.liked = savedFavorites.some(f => f.name === p.name);
    });
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
    const savedFavorites = this.favoritesService.getFavorites();


    this.pokemonService.loadPokemons(this.offset, this.limit).subscribe({
      next: (newPokemons) => {
        newPokemons.forEach(p => {
          if (savedFavorites.find(f => f.name === p.name)) {
            p.liked = true;
          }
        });

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

    this.isLoadingSuggestions = true;

    setTimeout(() => {
      this.suggestions = term.length >= 2
        ? this.allPokemonList.filter(p => p.name.includes(term)).slice(0, 10)
        : [];

      this.isLoadingSuggestions = false;
    }, 300);
  }

  goToPokemon(suggestion: { name: string; url: string }): void {
    const alreadyLoaded = this.pokemons.find(p => p.name === suggestion.name);

    if (alreadyLoaded) {
      const index = this.pokemons.findIndex(p => p.name === suggestion.name);
      this.swiper?.slideTo(index);
      this.clearSearch();
      return;
    }

    const minDelay = 600;
    this.isLoading = true;

    const delayPromise = new Promise(resolve => setTimeout(resolve, minDelay));

    //load from API
    Promise.all([delayPromise, firstValueFrom(this.pokemonService.fetchPokemonDetails(suggestion.url))])
      .then(([_, newPoke]) => {
        this.pokemons.push(newPoke);
        newPoke.liked = this.favoritesService.getFavorites().some(f => f.name === newPoke.name);

        setTimeout(() => {
          this.swiper?.update();
          const newIndex = this.pokemons.length - 1;
          this.swiper?.slideTo(newIndex);
        }, 100)

        this.clearSearch();
      })
      .catch((err) => {
        console.error('Erro ao buscar Pokémon:', err);
      })
      .finally(() => { this.isLoading = false; })
  }

  private clearSearch(): void {
    this.searchTerm = '';
    this.suggestions = [];
  }

  toggleLike(pokemon: PokemonModel): void {
    pokemon.liked = !pokemon.liked;
    this.favoritesService.toggleFavorites(pokemon);
  }

  async openDetailsModal(pokemonId: number) {
    const modal = await this.modalCtrl.create({
      component: DetailsComponent,
      componentProps: { id: pokemonId }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }
}
