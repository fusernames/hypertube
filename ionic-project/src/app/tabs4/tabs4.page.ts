/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tabs4.page.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/15 07:51:53 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 07:51:53 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs4',
  templateUrl: './tabs4.page.html',
  styleUrls: ['./tabs4.page.scss'],
})
export class Tabs4Page implements OnInit {

  constructor(private authService: AuthService,
              private navControler: NavController) { }

  ngOnInit() {
  }

  async onGoAccount() {
    console.log('hello');
  }

  async onGoData() {
    console.log('hello');
  }

  async onGoSecurity() {
    console.log('hello');
    // this.navControler.navigateForward()
  }

  onLogout(): void {
    this.authService.logout();
  }
}
