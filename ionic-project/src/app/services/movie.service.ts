/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   movie.service.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/10 16:55:52 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 09:51:36 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Injectable } from '@angular/core';
import { Movie } from '../models/Movie';
import { CoreService } from './core.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Subscription, Subject } from 'rxjs';
import { MovieEntity } from '../models/MovieEntity';

@Injectable({
  providedIn: 'root'
})
export class MovieService extends CoreService {
  movie: Movie;
  token$: Subscription;
  private movies: MovieEntity[] = [];
  moviesSubject = new Subject<MovieEntity[]>();
  movies$ = this.moviesSubject.asObservable();
  again = true;

  constructor(public http: HttpClient,
              protected loadingCtrl: LoadingController) {
    super(http, loadingCtrl);
  }

  emitMovies(): void {
    this.moviesSubject.next(this.movies);
  }

  async getMyMovies({ userId, page }: { userId: number; page: number; }) {
    if (this.again) {
      const params = {
        url: `${this.url}/api/movies?movieStatuses.user=${userId}&page=${page}`,
        headers: null
      };

      try {
        const movies = await this.get(params);
        // console.log(movies);
        if ((this.again = movies['hydra:member'].length > 0)) {
          movies['hydra:member'].forEach(
            (movie: MovieEntity) => {
              if (!this.movies.length || !this.movies.find(_movie => _movie.APIId === movie.APIId)) {
                this.movies = this.movies.concat(movie);
              }
            }
          );
          // console.log(this.movies);
          this.emitMovies();
        }
      } catch (err) { throw err; }
    }
  }

  async getMovieStatuses({ movieId, userUri }: { movieId: number; userUri: string; }): Promise<any> {
    const params = {
      url: `${this.url}/api/movie_statuses.json?movie.id=${movieId}&user=${userUri}`,
      headers: null
    };

    try {
      const movies = await this.get(params);
      console.log(movies);
    } catch (err) {
      throw err;
    }
  }

  async createMovieStatuses({ movieId, userUri }: { movieId: number; userUri: string; }) {
    const params = {
      url: `${this.url}/api/movie_statuses`,
      data: {
        user: userUri,
        movie: `/api/movies/${movieId}`
      },
      headers: null
    };

    try {
      return await this.post(params);
    } catch (err) {
      throw err;
    }
  }

  async updateMovieStatuses({ movieId, movieStatuses }: { movieId: number; movieStatuses: any; }) {
    const params = {
      url: `${this.url}/api/movie_statuses/${movieId}`,
      data: movieStatuses,
      headers: null
    };

    try {
      return await this.put(params);
    } catch (err) {
      throw err;
    }
  }

  async download(url: string) {
    const params = {
      method: 'post',
      url: '/api/movies/torrent/download',
      data: { torrent_url: url },
      headers: null
    };

    try {
      return await this.request(params);
    } catch (err) {
      throw err;
    }
  }
}
