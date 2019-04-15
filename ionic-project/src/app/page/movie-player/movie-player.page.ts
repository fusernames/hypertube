/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   movie-player.page.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/11 14:02:16 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 05:47:59 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MovieService } from 'src/app/services/movie.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { ActivatedRoute } from '@angular/router';
import { MovieStatuses } from 'src/app/models/MovieStatuses';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/Message';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-movie-player',
  templateUrl: './movie-player.page.html',
  styleUrls: ['./movie-player.page.scss'],
})
export class MoviePlayerPage implements OnInit, OnDestroy {
  @ViewChild('player') elementPlayer: ElementRef;

  user: User;

  movieId: number;
  movieUrl: string;

  token$: Subscription;
  user$: Subscription;

  oldTime: number;

  player: any;

  messages: Message[] = [];

  today: Date;

  newMessage: string;
  alert: any;

  constructor(private userService: UserService,
              private movieService: MovieService,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.today = new Date();

    this.setToken();
    this.setUser();
    this.setMovieId();
    this.getMovieStatuses();
    this.getMessages();
  }

  ngOnDestroy(): void {
    this.token$.unsubscribe();
    this.user$.unsubscribe();
  }

  async onCreateMessage() {
    console.log('create');
    this.alert = await this.alertCtrl.create({
      header: 'Ajouter un commentaire',
      inputs: [
        {
          name: 'message',
          type: 'text'
        }
      ],
      backdropDismiss: true,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Valider',
          handler: (data) => this.postNewMessage(data)
        }
      ]
    });

    await this.alert.present();
  }

  async postNewMessage({ message }: { message: string; }) {
    const param = {
      msg: message.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      ownerId: this.userService.id
    };

    try {
      this.messages.unshift(await this.messageService.createMessage(param));
    } catch (e) {
      console.log(e);
    }
  }

  async getMessages(event?: any) {
    if (this.messageService.hasMessageUrl()) {
      try {
        this.setMessages(await this.messageService.getMessageByMovie());
      } catch (err) {
        console.log(err);
      }
    }
    if (event) {
      event.target.complete();
    }
  }

  setMessages(resp: any): void {
    // console.log(resp);
    this.messages = this.messages.length ? this.messages.concat(resp['hydra:member']) : resp['hydra:member'];
    const params = {
      movieId: null,
      messageUrl: resp['hydra:view']['hydra:next']
    };

    if (this.messages.length < resp['hydra:totalItems']) {
      this.messageService.setMessageUrl(params);
    } else {
      this.messageService.unsetMessageUrl();
    }
    // console.log(this.messages);
  }

  setMovieId(): void {
    this.movieId = +this.route.snapshot.paramMap.get('movieId');
    this.movieUrl = `${this.movieService.url}/api/movies/file/${this.movieId}`;

    this.messageService.setMovieId(this.movieId);
  }

  async getMovieStatuses() {
    const params = {
      movieId: this.movieId,
      userUri: this.userService.uri
    };

    try {
      const status = await this.movieService.getMovieStatuses(params);
      status && status.length ? this.setPlayer(status[0]) : this.createStatuses(params);
    } catch (err) {
      console.log(err);
    }
  }

  async createStatuses({ movieId, userUri }: { movieId: number; userUri: string; }) {
    console.log('create new movis status');
    try {
      this.setPlayer(await this.movieService.createMovieStatuses({movieId, userUri}));
    } catch (err) {
      console.log(err);
    }
  }

  setPlayer(status: MovieStatuses): void {
    this.player = this.elementPlayer.nativeElement;
    this.oldTime = status.time;
    this.player.oncanplay = () => {
      console.log('can play');
      this.player.ontimeupdate = e => this.updateTime({ time: e.target.currentTime, statusId: status.id });
    };

    if (this.player.currentTime < status.time) {
      this.player.currentTime = status.time;
    }
  }

  updateTime({ time, statusId }: { time: number; statusId: number; }) {
    if (time - this.oldTime > 10) {
      time = Math.round(time);
      this.oldTime = time;
      const params = {
        movieId: statusId,
        movieStatuses: {
          time
        }
      };
      this.movieService.updateMovieStatuses(params);
    }
  }

  setUser(): void {
    this.user$ = this.userService.user$.subscribe(
      (user: User) => this.user = user,
      err => console.log(err)
    );

    this.userService.emitUser();
  }

  setToken(): void {
    this.token$ = this.userService.token$.subscribe(
      token => {
        this.movieService.setToken(token);
        this.messageService.setToken(token);
      },
      err => console.log(err)
    );

    this.userService.emitToken();
  }

}
