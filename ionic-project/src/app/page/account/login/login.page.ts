/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.page.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/07 18:59:05 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 10:22:47 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  public loginForm: FormGroup;
  public requesting = false;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              private userService: UserService) {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(255)
        ]
      ]
    });
  }

  async onLogin() {
    this.authService.logout();
    this.requesting = true;
    const formValue = this.loginForm.value;

    if (this.loginForm.valid) {
      try {
        await this.authService.login(formValue);
        this.successHandle();
      } catch (err) {
        this.errorHandle(err);
      } finally {
        this.requesting = false;
      }
    }
  }

  async successHandle() {
    const toast = await this.toastCtrl.create({
      message: `Bienvenue ${this.userService.username}, pleins de nouveaux films vous attendent 🤗`,
      duration: 3500,
      position: 'bottom',
      color: 'success'
    });
    this.requesting = false;

    this.loginForm.reset();
    toast.present();
  }

  async errorHandle(err: any) {
    const toast = await this.toastCtrl.create({
      message: err.error.message,
      duration: 3500,
      position: 'bottom',
      color: 'danger'
    });
    this.requesting = false;

    toast.present();
  }
}
