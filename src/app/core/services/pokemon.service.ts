import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { PokemonModel } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2'

  constructor(private http: HttpClient) { }

  //request pokemons api woth all details
  private fetchPokemons(limit: number, offset: number): Observable<PokemonModel[]> {
    return this.http
      .get<{ results: { name: string; url: string }[] }>(
        `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
      )
      .pipe(
        switchMap((res) => {
          const requests: Observable<PokemonModel>[] = res.results.map((p) =>
            this.http.get<any>(p.url).pipe(
              map((data): PokemonModel => ({
                id: data.id,
                name: data.name,
                image: data.sprites.other['official-artwork'].front_default,
                type: data.types.map((t: any) => t.type.name),
              }))
            )
          );

          return forkJoin(requests);
        })
      );
  }

  //load pokemons local cache
  loadPokemons(options: {
    limit: number;
    offset: number;
    useCache?: boolean;
  }): Observable<PokemonModel[]> {
    const { limit, offset, useCache = false } = options;

    //if cache = null
    if (useCache && offset === 0) {
      const cached = localStorage.getItem('pokemons');
      if (cached) {
        try {
          return of(JSON.parse(cached) as PokemonModel[]);
        } catch (e) {
          console.warn('❌ Erro ao ler cache:', e);
        }
      }
    }

    return this.fetchPokemons(limit, offset).pipe(
      tap((pokemons) => { if (useCache && offset === 0) { localStorage.setItem('pokemons', JSON.stringify(pokemons)); } })
    );
  }
}
