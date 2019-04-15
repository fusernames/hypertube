/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   profile.page.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/15 10:49:51 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 11:05:26 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  user: User;
  user$: Subscription;

  userForm: FormGroup;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder) { }

  async ngOnInit() {
    await this.setProfile();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.user$.unsubscribe();
  }

  initForm(): void {
    const namePattern = /^([A-Za-zàéèêëîïôöûüùç.]+(( |')[A-Za-zàéèêëîïôöûüùç.]+)*)+([-]([A-Za-zàéèêëîïôöûüùç.]+(( |')[A-Za-zàéèêëîïôöûüùç.]+)*)+)*$/;
    this.userForm = this.formBuilder.group({
      email: [
        this.user.email,
        [
          Validators.required,
          Validators.email
        ]
      ],
      login: [
        this.user.username,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ]
      ],
      firstname: [
        this.user.firstname,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
          Validators.pattern(namePattern)
        ]
      ],
      lastname: [
        this.user.lastname,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
          Validators.pattern(namePattern)
        ]
      ]
    });
  }
  async setProfile() {
    this.user$ = await this.userService.user$.subscribe(user => this.user = user);

    this.userService.emitUser();
    console.log(this.user);
  }

}
