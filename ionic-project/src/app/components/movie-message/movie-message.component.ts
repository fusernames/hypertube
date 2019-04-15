/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   movie-message.component.ts                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/12 12:45:32 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/12 20:53:14 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/models/Message';

@Component({
  selector: 'app-movie-message',
  templateUrl: './movie-message.component.html',
  styleUrls: ['./movie-message.component.scss'],
})
export class MovieMessageComponent implements OnInit {
  @Input() message: Message;
  @Input() today: Date;

  timeDifference = '';

  ngOnInit() {
    this.timeDifference = this.getTimeDifference(this.message.createdAt);
  }

  getAvatar(link: string): string {
    return link.replace(' ', '%20');
  }

  isReadable(message: string): boolean {
    return message && message.length && !/^\s+$/.test(message);
  }

  getTimeDifference(time: string): string {
    const fst = this.message.createdAt.split('T');
    const createdAt = new Date(`${fst[0]} ${fst[1].split('+')[0]}`);
    const msec = this.today.getTime() - createdAt.getTime() - 7200000;
    const mins = Math.floor(msec / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) { return `il y a ${days} jours`; }
    if (hrs > 0) { return  `il y a ${hrs} heures`; }
    return `il y a ${mins < 0 ? 0 : mins} minutes`;
  }
}
