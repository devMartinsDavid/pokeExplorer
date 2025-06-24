import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { PokemonModel } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2'
  private readonly cacheKey = 'pokemons';

  constructor(private http: HttpClient) { }

  //request pokemons api woth all details
   private fetchPokemons(limit: number, offset: number): Observable<PokemonModel[]> {
    return this.http
      .get<{ results: { name: string; url: string }[] }>(
        `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
      )
      .pipe(
        switchMap((response) => {
          const requests = response.results.map((p) => this.fetchPokemonDetails(p.url));
          return forkJoin(requests);
        })
      );
  }
  // Fetch single pokemon details
  private fetchPokemonDetails(url: string): Observable<PokemonModel> {
    return this.http.get<any>(url).pipe(
      map((data) => ({
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        type: data.types.map((t: any) => t.type.name),
      }))
    );
  }

   // Load pokemons from cache or API
  loadPokemons(offset: number, limit: number): Observable<PokemonModel[]> {
    const cachedData = this.getCachedPokemons();

    // Return cached slice if enough data available
    if (cachedData.length >= offset + limit) {
      return of(cachedData.slice(offset, offset + limit));
    }

    // Otherwise, fetch from API and update cache
    return this.fetchPokemons(limit, offset).pipe(
      map((newPokemons) => {
        const updatedCache = this.mergeUniquePokemons(cachedData, newPokemons);
        this.setCachedPokemons(updatedCache);
        return newPokemons;
      })
    );
  }

  // Helpers for cache management

  private getCachedPokemons(): PokemonModel[] {
    const cache = localStorage.getItem(this.cacheKey);
    return cache ? JSON.parse(cache) : [];
  }

  private setCachedPokemons(pokemons: PokemonModel[]): void {
    localStorage.setItem(this.cacheKey, JSON.stringify(pokemons));
  }

  // Merge new pokemons with cache avoiding duplicates by ID
  private mergeUniquePokemons(
    cached: PokemonModel[],
    newPokemons: PokemonModel[]
  ): PokemonModel[] {
    const cachedIds = new Set(cached.map((p) => p.id));
    const filteredNew = newPokemons.filter((p) => !cachedIds.has(p.id));
    return [...cached, ...filteredNew];
  }

}
