/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tab1.page.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/08 22:17:43 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 02:50:11 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../services/core.service';
import { ApiYts } from '../models/ApiYts';
import { ApiPopCornTime } from '../models/ApiPopCornTime';
import { Movies } from '../models/Movies';
import { IonInfiniteScroll } from '@ionic/angular';
import { Api } from '../models/Api';

class Sort {
  constructor(public name: string, public value: string) {}
}

class Gender {
  constructor(public name: string, public value: string) {}
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  protected ApiIndex = 0;
  protected genderIndex = 0;
  protected sortIndex = 0;
  protected page = 1;

  protected scroll = false;

  protected url: string;

  protected movies = new Movies();

  protected APIS: Api[] = [
    new ApiYts(),
    new ApiPopCornTime()
  ];

  protected SORTS: Sort[] = [
    new Sort('Aucun', 'none'),
    new Sort('Note', 'rating'),
    new Sort('Année de production', 'year'),
    new Sort('Titre', 'title')
  ];

  protected GENDERS: Gender[] = [
    new Gender('Aucun', 'none'),
    new Gender('Action', 'action'),
    new Gender('Aventure', 'adventure'),
    new Gender('Animation', 'animation'),
    new Gender('Comédie', 'comedy'),
    new Gender('Criminel', 'crime'),
    new Gender('Documentaire', 'documentary'),
    new Gender('Drame', 'drama'),
    new Gender('Famile', 'family'),
    new Gender('Fantaisie', 'fantasy'),
    new Gender('Film noir', 'film-noir'),
    new Gender('Histoire', 'history'),
    new Gender('Horreur', 'horror'),
    new Gender('Musique', 'music'),
    new Gender('Mystère', 'mystery'),
    new Gender('Sport', 'sport'),
    new Gender('Romance', 'romance'),
    new Gender('Science Fiction', 'sci-fi'),
    new Gender('Thriller', 'Thriller'),
    new Gender('Guerre', 'war'),
    new Gender('Western', 'western'),
    new Gender('Biographie', 'biography'),
    new Gender('Comédie musicale', 'musical')
  ];

  constructor(private coreService: CoreService) { }

  ngOnInit(): void {
    this.getMovies();
  }

  async getMovies(event?) {
    const gender = this.GENDERS[this.genderIndex].value;
    const sort = this.SORTS[this.sortIndex].value;
    const params = {
      url: this.APIS[this.ApiIndex].getUrl({gender, sort, page: this.page}),
      headers: {}
    };

    try {
      const resp = await this.coreService.get(params);
      // console.log(resp);
      this.movies = this.APIS[this.ApiIndex].getMovies({movies: this.movies, resp, event});
    } catch (err) {
      console.log(err);
    } finally {
      event ? event.target.complete() : 0;
    }
  }

  loadData(event): void {
    ++this.page;
    this.getMovies(event);
  }

  onChangeApi(event: any) {
    this.page = 1;
    this.ApiIndex = this.APIS.findIndex(api => api.value === event.detail.value);
    this.getMovies();
  }

  onChangeGender(event: any) {
    this.page = 1;
    this.genderIndex = this.GENDERS.findIndex(gender => gender.value === event.detail.value);
    this.getMovies();
  }

  onChangeSort(event: any) {
    this.page = 1;
    this.sortIndex = this.SORTS.findIndex(sort => sort.value === event.detail.value);
    this.getMovies();
  }
}
