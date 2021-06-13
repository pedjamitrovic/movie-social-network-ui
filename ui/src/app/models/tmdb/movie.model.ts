import { Company } from './company.model';
import { Country } from './country.model';
import { Genre } from './genre.model';

export interface Movie {
  id?: number;
  original_title?: string;
  title?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  budget?: number;
  genres?: Genre[];
  imdb_id?: string;
  overview?: string;
  production_companies?: Company[];
  production_countries?: Country[];
  revenue?: number;
  runtime?: number;
  status?: string;
  tagline?: string;
  original_language?: string;
}
