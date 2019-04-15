/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   signup.page.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/08 01:31:05 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/13 18:40:23 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  requesting = false;

  public signupForm: FormGroup;

  private NAME_PATTERN = /^([A-Za-zàéèêëîïôöûüùç.]+(( |')[A-Za-zàéèêëîïôöûüùç.]+)*)+([-]([A-Za-zàéèêëîïôöûüùç.]+(( |')[A-Za-zàéèêëîïôöûüùç.]+)*)+)*$/;
  private PASSWORD_PATTERN = /^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private toastCtrl: ToastController) {
    this.initForm();
  }

  initForm(): void {
    this.signupForm = this.formBuilder.group({
      firstname: [
        '',
        [
          Validators.minLength(2),
          Validators.maxLength(40),
          Validators.pattern(this.NAME_PATTERN)
        ]
      ],
      lastname: [
        '',
        [
          Validators.minLength(2),
          Validators.maxLength(40),
          Validators.pattern(this.NAME_PATTERN)
        ]
      ],
      email: [
        '',
        [
          Validators.email,
          Validators.required
        ]
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ]
      ],
      plainPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(this.PASSWORD_PATTERN)
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/)
        ]
      ]
    });
  }

  async onSignup() {
    this.requesting = true;
    const formValue = this.signupForm.value;
    const email = formValue.email;
    const password = formValue.plainPassword;
    const createParams = {
      method: 'post',
      url: '/api/users',
      data: formValue,
      toastMsg: 'Inscription en cours ...'
    };

    if (this.signupForm.valid) {
      try {
        await this.userService.request(createParams);
        await this.authService.login({email, password});
        this.successHandler();
      } catch (err) {
        this.errorHandler(err);
      } finally {
        this.finalHandler();
      }
    }
  }

  finalHandler(): void {
    this.requesting = false;
  }

  async successHandler() {
    const toast = await this.toastCtrl.create({
      message: `Bienvenue ${this.userService.username}. Nous sommes heureux de compter parmis nos membres 🤩`,
      duration: 4000,
      position: 'bottom',
      color: 'success'
    });

    toast.present();
  }

  async errorHandler(err: any) {
    const toast = await this.toastCtrl.create({
      message: err.error['hydra:description'],
      position: 'bottom',
      duration: 4000,
      color: 'danger'
    });

    toast.present();
  }

}
