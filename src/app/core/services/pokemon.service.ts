import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
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
  fetchPokemonDetails(url: string): Observable<PokemonModel> {
    return this.http.get<any>(url).pipe(
      map((data) => ({
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        type: data.types.map((t: any) => t.type.name),
        height: data.height,
        weight: data.weight,
        base_experience: data.base_experience,
        stats: {
          hp: data.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0,
          attack: data.stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 0,
          defense: data.stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 0,
          special_attack: data.stats.find((s: any) => s.stat.name === 'special-attack')?.base_stat || 0,
          special_defense: data.stats.find((s: any) => s.stat.name === 'special-defense')?.base_stat || 0,
          speed: data.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 0,
        },
        abilities: data.abilities.map((a: any) => a.ability.name)
      }))
    );
  }
  getPokemonById(id: number): Observable<PokemonModel> {
    return this.fetchPokemonDetails(`${this.baseUrl}/pokemon/${id}`);
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

  getAllPokemonNames(): Observable<{ name: string; url: string }[]> {
    return this.http
      .get<{ results: { name: string; url: string }[] }>(
        `${this.baseUrl}/pokemon?limit=100000&offset=0`
      )
      .pipe(map(res => res.results));
  }


}
