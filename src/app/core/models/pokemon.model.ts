export interface PokemonModel {
  id: number;
  name: string;
  image: string;
  type: string[];
  height?: number;
  weight?: number;
  base_experience?: number;
  stats?: {
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
  abilities?: string[];
  liked?: boolean;
}
