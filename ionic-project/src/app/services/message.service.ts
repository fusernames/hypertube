/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   message.service.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/11 23:43:17 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/12 17:46:21 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Injectable } from '@angular/core';
import { CoreService } from './core.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends CoreService {
  token$: Subscription;

  private movieId: number;

  messageUrl: string;

  constructor(public http: HttpClient,
              public loadingCtrl: LoadingController) {
    super(http, loadingCtrl);
  }

  async getMessageByMovie() {
    const url = this.url + this.messageUrl;

    try {
      return await this.get({ url, headers: null });
    } catch (err) {
      return err;
    }
  }

  async createMessage({ msg, ownerId }: { msg: string; ownerId: number; }) {
    const param = {
      method: 'post',
      url: '/api/messages',
      data: {
        message: msg,
        owner: '/api/users/' + ownerId,
        movie: '/api/movies/' + this.movieId
      },
      toastMsg: 'Le message est en cours de publication ...'
    };

    try {
      return await this.request(param);
    } catch (err) {
      return err;
    }
  }

  setMovieId(movieId: number): void {
    this.movieId = movieId;

    this.setMessageUrl({ movieId: this.movieId });
  }

  setMessageUrl({ movieId, messageUrl }: { movieId?: number; messageUrl?: string; } = {}): void {
    if (movieId) {
      this.messageUrl = `/api/movies/${movieId}/messages?order[id]=DESC&page=1`;
    } else if (messageUrl) {
      this.messageUrl = messageUrl;
    }
  }

  unsetMessageUrl(): void {
    this.messageUrl = null;
  }

  hasMessageUrl(): boolean {
    return !!this.messageUrl;
  }

}
