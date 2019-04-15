/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   security.page.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/15 07:36:08 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 08:29:43 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.page.html',
  styleUrls: ['./security.page.scss'],
})
export class SecurityPage implements OnInit {
  public passwordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.passwordForm = this.formBuilder.group({
      current_password: ['', [Validators.required, Validators.pattern(/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/)]],
      new_password: ['', [Validators.required, Validators.pattern(/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/)]],
      confirm_new_password: ['', [Validators.required, Validators.pattern(/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/)]]
    });
  }

  async onWantChangePassword() {
    const test = '1Dlavaury';
    const formValue = this.passwordForm.value;

    if (this.passwordForm.invalid || formValue.new_password !== formValue.confirm_new_password) {
      return ;
    }
    console.log(formValue);
    try {
      const resp = await this.userService.changePassword(formValue);
    } catch (err) {
      console.log(err);
    }
  }

}
