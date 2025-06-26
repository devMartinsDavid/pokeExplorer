import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

import { PokemonModel } from '../../core/models/pokemon.model';
import { PokemonService } from '../../core/services/pokemon.service';
import { FavoritesService } from '../../core/services/favorites.service';

import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
addIcons({
  'heart': heart,
  'heart-outline': heartOutline
});
@Component({
  selector: 'app-details',
  standalone:true,
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  imports:[
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
    IonIcon
  ]
})
export class DetailsComponent  implements OnInit {
  @Input() id!: number;

  pokemonId!: number;
  pokemon: PokemonModel | null = null;
  openedAsModal = false;
  isMobile = false;

  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService
  ) { }

  ngOnInit() {

    this.isMobile = window.innerWidth < 576;
    //check if  opened
    if (this.id) {
      this.openedAsModal = true;
      this.pokemonId = this.id;
      this.loadPokemon();
    } else{
      //no modal? Get id route
      this.route.paramMap.subscribe(params => {
        const idParams = params.get('id');
        if (idParams) {
          this.pokemonId = Number(params.get('id'));
          this.loadPokemon();
        }
      });
    }
  }

  loadPokemon() {
    this.pokemonService.getPokemonById(this.pokemonId).subscribe({
      next: (poke) => {
        // Manter liked with favorites
        poke.liked = this.favoritesService.isFavorite(poke.name);
        this.pokemon = poke;
      },
      error: (err) => {
        console.error('Erro ao carregar Pokémon:', err);
      }
    });
  }

  toggleLike() {
    if (!this.pokemon) return;
    this.favoritesService.toggleFavorites(this.pokemon);
    this.pokemon.liked = !this.pokemon.liked;
  }


  async share(){
     if (!this.pokemon) return;
    const shareData = {
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
