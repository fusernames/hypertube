/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   movie-detail.page.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/10 16:57:31 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 09:52:08 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/Movie';
import { MovieService } from 'src/app/services/movie.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { MovieEntity } from 'src/app/models/MovieEntity';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
})
export class MovieDetailPage implements OnInit {
  trustedVideoUrl: SafeResourceUrl;
  movie: Movie;

  constructor(private movieService: MovieService,
              public domSanitizer: DomSanitizer) {
    this.movie = this.movieService.movie;
    // console.log(this.movie);
  }

  ngOnInit() {
    this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.movie.trailer);

    this.setSavedMovies();
  }

  async setSavedMovies() {
    const params = {
      url: `${this.movieService.url}/api/movies?APIId=${this.movie.id}`,
      headers: null
    };

    try {
      const savedMovies = await this.movieService.get(params);
      // console.log(savedMovies);
      savedMovies['hydra:member'].forEach(async (movie: MovieEntity) => {
        if (!movie.image || !movie.year || !movie.rating || !movie.title || !movie.description) {
          const updatedParams = {
            url: this.movieService.url + movie['@id'],
            data: {
              image: this.movie.image,
              year: this.movie.year,
              rating: this.movie.rating,
              title: this.movie.title,
              description: this.movie.description
            },
            headers: null
          };
          try {
            await this.movieService.put(updatedParams);
          } catch (err) { console.log(err); }
        }
      });
    } catch (err) { console.log(err); }
  }
}
