import { Component, OnInit } from '@angular/core';
import { PokemonModel } from '../../core/models/pokemon.model';
import { PokemonService } from '../../core/services/pokemon.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SwiperModule } from 'swiper/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonicModule, CommonModule, HttpClientModule, SwiperModule]
})
export class HomeComponent  implements OnInit {
  pokemons: PokemonModel[] = [];
  offset =0;
  slidOpts = {
    slidesPerView: 1.2,
    spaceBetween: 10,
  };

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadMorePokemons();
  }

  loadMorePokemons() {
    this.pokemonService.getPokemons(10, this.offset).subscribe((data) => {
      this.pokemons.push(...data);
      this.offset += 10;
    });
  }

}
