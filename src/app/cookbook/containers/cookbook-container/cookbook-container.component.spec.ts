import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookbookContainerComponent } from './cookbook-container.component';

describe('CookbookContainerComponent', () => {
  let component: CookbookContainerComponent;
  let fixture: ComponentFixture<CookbookContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookbookContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookbookContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
