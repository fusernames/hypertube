/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.service.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/07 18:29:28 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/14 14:11:07 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Injectable } from '@angular/core';
import { CoreService } from './core.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CoreService {
  private user: User;
  user$ = new Subject<User>();
  token$ = new Subject<string>();

  constructor(public http: HttpClient,
              private storage: Storage,
              public loadingCtrl: LoadingController) {
    super(http, loadingCtrl);
  }

  emitUser(): void {
    this.user$.next(this.user);
  }

  emitToken(): void {
    this.token$.next(this.token);
  }

  async getToken(data: any) {
    const params = {
      method: 'post',
      url: '/api/login_check',
      data,
      toastMsg: 'Vérification des identifiants ...'
    };

    try {
      const token = await this.request(params);
      await this.setToken(token.token);
      return this.token;
    } catch (error) {
        throw error;
    }
  }

  setToken(token: string): void {
    this.storage.set('hypertube-token', token);
    this.token = token;
    this.emitToken();
  }

  async getProfile() {
    const param = {
      method: 'get',
      url: '/api/users/me',
      data: null,
      toastMsg: 'Connexion en cours ...'
    };

    try {
      this.user = await this.request(param);
      this.emitUser();
      return this.user;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    this.user = null;
    this.token = null;
    this.storage.remove('hypertube-token');

    this.emitUser();
    this.emitToken();
  }

  get username(): string {
    return this.user ? this.user.username : null;
  }

  get uri(): string {
    return this.user ? this.user['@id'].replace('me?id=', '') : null;
  }

  get id(): number {
    return this.user ? this.user.id : null;
  }
}
