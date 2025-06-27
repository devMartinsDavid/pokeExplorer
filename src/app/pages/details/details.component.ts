import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import {
  IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonSpinner, IonTitle, IonToolbar, ModalController
} from '@ionic/angular/standalone';

import { PokemonModel } from '../../core/models/pokemon.model';
import { PokemonService } from '../../core/services/pokemon.service';
import { FavoritesService } from '../../core/services/favorites.service';

import Swiper from 'swiper';
import 'swiper/element/bundle';
import { Navigation, Pagination, EffectCards } from 'swiper/modules';
Swiper.use([Navigation, Pagination, EffectCards]);

import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
addIcons({
  'heart': heart,
  'heart-outline': heartOutline
});

interface SwiperElement extends HTMLElement {
  initialize?: () => void;
  swiper?: any;
}

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonButtons,
    IonButton,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonSpinner
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailsComponent implements OnInit {
  @ViewChild('detailsSwiper') swiperRef?: ElementRef<SwiperElement>;
  @Input() id?: number;

  pokemonId!: number;
  pokemon: PokemonModel | null = null;
  openedAsModal = false;
  isLoading = false;
  private swiperInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService,
  ) {}

  async ngOnInit() {
    await this.determinePokemonId();
    if (this.pokemonId) {
      await this.loadPokemon();
    }

    //accessibility
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 100);

  }

  private async determinePokemonId() {
    if (this.id != null) {
      this.openedAsModal = true;
      this.pokemonId = this.id;
    } else {
      const params = await firstValueFrom(this.route.paramMap);
      const idParams = params.get('id');
      if (idParams) {
        this.pokemonId = Number(idParams);
      }
    }
  }

  private async fetchPokemon() {
    const poke = await firstValueFrom(this.pokemonService.getPokemonById(this.pokemonId));
    if (!poke) throw new Error('Pokémon não encontrado');
    poke.liked = this.favoritesService.isFavorite(poke.name);
    this.pokemon = poke;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private tryInitializeSwiper() {
    const swiperEl = this.swiperRef?.nativeElement;
    if (!swiperEl) return;

    const hasSlides = swiperEl.querySelector('swiper-slide');
    const notInitialized = !swiperEl.swiper;

    if (hasSlides && notInitialized && !this.swiperInitialized) {
      swiperEl.initialize?.();
      this.swiperInitialized = true;
    }
  }

  private async loadPokemon() {
    this.isLoading = true;
    this.swiperInitialized = false;

    try {
      await this.fetchPokemon();
      await this.delay(600);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
      setTimeout(() => this.tryInitializeSwiper(), 0);
    }
  }

  toggleLike() {
    if (!this.pokemon) return;
    this.pokemon.liked = !this.pokemon.liked;
    this.favoritesService.toggleFavorites(this.pokemon);
  }

  async share() {
    if (!this.pokemon) return;
    const shareData:ShareData = {
      title: `Pokémon ${this.pokemon.name}`,
      text: `Olha esse Pokémon incrível: ${this.pokemon.name}`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert('Compartilhamento não suportado neste navegador.');
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
