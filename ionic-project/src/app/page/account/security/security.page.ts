/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   security.page.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/15 07:36:08 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 10:49:02 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.page.html',
  styleUrls: ['./security.page.scss'],
})
export class SecurityPage implements OnInit {
  public passwordForm: FormGroup;

  requesting = false;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private toastCtrl: ToastController,
              private authService: AuthService,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    const pattern = /^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/;
    this.passwordForm = this.formBuilder.group({
      current_password: ['', [Validators.required, Validators.pattern(pattern)]],
      new_password: ['', [Validators.required, Validators.pattern(pattern)]],
      confirm_new_password: ['', [Validators.required, Validators.pattern(pattern)]]
    });
  }

  async onWantChangePassword() {
    const test = '1Dlavaury';
    const formValue = this.passwordForm.value;
    this.requesting = true;

    if (this.passwordForm.invalid || (formValue.new_password !== formValue.confirm_new_password)) {
      await this.invalidConfirm();
      this.requesting = false;
      return ;
    }
    try {
      await this.userService.changePassword(formValue);
      this.successHandler();
    } catch (err) {
      this.errorHandler(err);
    } finally {
      this.requesting = false;
    }
  }

  async successHandler() {
    const toast = await this.toastCtrl.create({
      message: 'Votre mot de passe a bien été modifié. Veuillez vous reconnecter maintenant.',
      position: 'bottom',
      duration: 5000,
      color: 'success'
    });

    toast.present();
    this.authService.logout();
  }

  async invalidConfirm() {
    const toast = await this.toastCtrl.create({
      message: 'Le mot de passe de confirmation est différent',
      position: 'bottom',
      duration: 2000,
      color: 'danger'
    });

    toast.present();
  }

  async errorHandler(error: any) {
    const toast = await this.toastCtrl.create({
      message: error.error.message,
      position: 'bottom',
      duration: 3000,
      color: 'danger'
    });

    toast.present();
  }

  async onDeleteAccount() {
    const alert = await this.alertCtrl.create({
      header: 'Suppression du compte',
      message: 'Vous êtes sur le point de supprimer définitivement votre compte. Cette action est irréversible. Êtes-vous sûr(e) de vouloir continuer?',
      cssClass: 'dark',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Confirmer',
          cssClass: 'danger',
          handler: () => this.deleteAccount()
        }
      ]
    });

    await alert.present();
  }

  async deleteAccount() {
    const toast = await this.toastCtrl.create({
      message: 'Toutes vos données ont bien été supprimées. Nous esperons vous revoir très vite.😢😢😢',
      position: 'bottom',
      duration: 5000,
      color: 'success'
    });

    try {
      await this.userService.removeAccount();
      toast.present();
      this.authService.logout();
    } catch (err) {
      this.errorHandler(err);
    }
  }

}
