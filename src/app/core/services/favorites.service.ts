import { Injectable } from '@angular/core';
import { PokemonModel } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly storageKey = 'favorites';

  constructor() { }

  getFavorites(): PokemonModel[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  isFavorite(name: string): boolean {
    return this.getFavorites().some(p => p.name === name)
  }

  toggleFavorites(pokemon: PokemonModel): void {
    const favorites = this.getFavorites();
    const exists = favorites.find(p => p.name === pokemon.name);

    let updated: PokemonModel[];

    if (exists) {
      updated = favorites.filter(p => p.name !== pokemon.name)
    } else {
      updated = [...favorites, { ...pokemon, liked: true }];
    }

    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }
}
