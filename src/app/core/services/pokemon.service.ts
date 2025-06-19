import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { PokemonModel } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2'

  constructor(private http: HttpClient) { }

  getPokemons(limit = 20, offset = 0): Observable<PokemonModel[]> {
    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`).pipe(
      switchMap((res: any) => {
        const pokemonRequests: Observable<any>[] = res.results.map((p: any) =>
          this.http.get<any>(p.url)
        );
        return forkJoin<any[]>(pokemonRequests);
      }),

      map((pokemons: any[]) => {
        return pokemons.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.sprites.other['official-artwork'].front_default,
          type: p.types.map((t: any) => t.type.name),
        }));
      })
    );
  }
}
