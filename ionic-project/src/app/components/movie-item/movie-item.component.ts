/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   movie-item.component.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/10 15:11:24 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 03:48:05 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, Input, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/Movie';
import { NavController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.scss'],
})
export class MovieItemComponent implements OnInit {
  @Input() movie: Movie;

  constructor(private navCtrl: NavController,
              private movieService: MovieService) {}

  ngOnInit(): void {
    // console.log(this.movie);
  }

  async onOpenMovie() {
    this.movieService.movie = this.movie;
    this.navCtrl.navigateForward('/tabs/tab1/movie-details');
  }
}
