/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tab3.page.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/13 19:04:03 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 09:35:08 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { MovieService } from '../services/movie.service';
import { Subscription } from 'rxjs';
import { Movie } from '../models/Movie';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  token$: Subscription;
  page = 1;

  constructor(private userService: UserService,
              public movieService: MovieService) { }

  ngOnInit(): void {
    this.setToken();
    this.getMovies();
  }

  ngOnDestroy(): void {
    this.token$.unsubscribe();
  }

  setToken(): void {
    this.token$ = this.userService.token$.subscribe(
      token => this.movieService.setToken(token)
    );

    this.userService.emitToken();
  }

  async getMovies(event?) {
    const params = {
      userId: this.userService.id,
      page: this.page
    };

    try {
      await this.movieService.getMyMovies(params);
      this.page++;
    } catch (err) {
      console.log(err);
    } finally {
      if (event) {
        event.target.complete();
      }
    }
  }
}
