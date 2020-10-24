import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListPageComponent } from './shopping-list-page.component';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';

describe('ShoppingListPageComponent', () => {
  let component: ShoppingListPageComponent;
  let fixture: ComponentFixture<ShoppingListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListPageComponent, TranslatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
