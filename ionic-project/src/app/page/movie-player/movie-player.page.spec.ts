import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviePlayerPage } from './movie-player.page';

describe('MoviePlayerPage', () => {
  let component: MoviePlayerPage;
  let fixture: ComponentFixture<MoviePlayerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoviePlayerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviePlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
