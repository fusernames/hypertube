/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   torrent-status.component.ts                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/10 23:14:09 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 03:56:08 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Torrent } from 'src/app/models/Torrent';
import { MovieService } from 'src/app/services/movie.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NavController } from '@ionic/angular';

class Status {
  constructor(public success: string, public movieId: number) {}
}

@Component({
  selector: 'app-torrent-status',
  templateUrl: './torrent-status.component.html',
  styleUrls: ['./torrent-status.component.scss'],
})
export class TorrentStatusComponent implements OnInit, OnDestroy {
  @Input() torrent: Torrent;

  token$: Subscription;

  play = false;
  downloading = false;
  inComponent = true;

  status: any;

  constructor(private movieService: MovieService,
              private userService: UserService,
              private navController: NavController) { }

  ngOnInit(): void {
    this.setToken();
    this.getStatus();
  }

  ngOnDestroy(): void {
    this.inComponent = false;
    this.token$.unsubscribe();
  }

  setToken(): void {
    this.token$ = this.userService.token$.subscribe(
      token => this.movieService.setToken(token),
      err => console.log(err)
    );

    this.userService.emitToken();
  }

  async getStatus() {
    if (!this.inComponent) { return ; }
    const params = {
      url: `${this.movieService.url}/api/movies/torrent/status`,
      data: { torrent_link: this.torrent.url },
      headers: null
    };

    try {
      this.successHandler(await this.movieService.post(params));
    } catch (err) {
      this.errorHandler(err);
    }
  }

  async successHandler(status: Status) {
    this.status = status;

    switch (status.success) {
      case 'DOWNLOAD_ENDED':
        this.unsetDonwloading();
        break ;
      default :
        this.setDownloading();
        setTimeout(
          () => this.getStatus(),
          2500
        );
        break ;
    }
  }

  errorHandler(err: HttpErrorResponse): void {
    this.status = err.error;
  }

  async onWantWatch() {
    if (this.play) {
      const params = ['tabs', 'tab1', 'movie-player', this.status.movieId];
      this.navController.navigateForward(params);
    } else if (this.status.error && this.status.error === 'UNKNOWN_MOVIE') {
      try {
        this.status.success = 0;
        this.setDownloading();
        await this.movieService.download(this.torrent.url);
        await this.getStatus();
      } catch (err) {
        console.log(err);
      }
    }
  }

  unsetDonwloading(): void {
    this.downloading = false;
    this.play = true;
  }

  setDownloading(): void {
    this.downloading = true;
    this.play = false;
    this.status.success = Math.floor(this.status.success) / 100;
    console.log(this.status);
  }
}
