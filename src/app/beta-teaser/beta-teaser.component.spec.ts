import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaTeaserComponent } from './beta-teaser.component';

describe('BetaTeaserComponent', () => {
  let component: BetaTeaserComponent;
  let fixture: ComponentFixture<BetaTeaserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetaTeaserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetaTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
