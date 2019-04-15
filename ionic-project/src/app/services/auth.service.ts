/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.service.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/07 17:56:27 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/13 18:24:43 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Injectable, OnInit, OnDestroy,  } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit, OnDestroy {
  private user: any;
  private isAuth = false;
  isAuth$ = new Subject<boolean>();
  user$: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.user$ = this.userService.user$.subscribe(
      user => {
        this.isAuth = true;
        this.emitIsAuth();
        this.user = user;
      }
    );

    this.userService.emitUser();
  }

  ngOnDestroy(): void {
    this.user$.unsubscribe();
  }

  emitIsAuth(): void {
    this.isAuth$.next(this.isAuth);
  }

  async login(data: any) {
    try {
      await this.userService.getToken(data);
      await this.getProfile();
    } catch (error) {
      throw error;
    }
  }

  async getProfile() {
    try {
      const profile = await this.userService.getProfile();
      this.isAuth = true;
      this.emitIsAuth();
      return profile;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    this.isAuth = false;

    this.userService.logout();
    this.emitIsAuth();
  }

  isAuthenticated(): boolean {
    return this.isAuth;
  }
}
