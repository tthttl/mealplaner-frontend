import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListFormComponent } from './shopping-list-form.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

describe('ShoppingListFormComponent', () => {
  let component: ShoppingListFormComponent;
  let fixture: ComponentFixture<ShoppingListFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListFormComponent, TranslatePipe ],
      providers: [TranslatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
