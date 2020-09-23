import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListContainerComponent } from './shopping-list-container.component';

describe('ShoppingListContainerComponent', () => {
  let component: ShoppingListContainerComponent;
  let fixture: ComponentFixture<ShoppingListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
