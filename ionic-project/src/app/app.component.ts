/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.component.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/07 17:03:39 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/12 17:20:02 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  isAuth = false;
  authentication$: Subscription;

  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private authService: AuthService,
              private router: Router,
              private storage: Storage,
              private userService: UserService) {
    this.initializeApp();
  }

  ngOnInit(): void {
    this.setState();
    this.getToken();
  }

  async getToken() {
    try {
      const token = await this.storage.get('hypertube-token');
      if (token) {
        await this.userService.setToken(token);
        try {
          await this.authService.getProfile();
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  setState(): void {
    this.authentication$ = this.authService.isAuth$.subscribe(
      isAuth => this.router.navigate([isAuth ? '/tabs' : '/login'])
    );

    this.authService.emitIsAuth();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.authService.isAuthenticated) {
        this.router.navigate(['/tabs']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    this.authentication$.unsubscribe();
  }
}
