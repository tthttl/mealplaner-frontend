import { DragDropModule } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { ArrayItemMovedEvent, ShoppingListItem } from '../../../shared/model/model';

import { ShoppingListComponent } from './shopping-list.component';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShoppingListComponent, TranslatePipe],
      imports: [DragDropModule, MatCheckboxModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render shopping list', () => {
    component.items = [
      {id: '1', shoppingList: '42', title: 'Mehl', amount: 1, unit: 'kg'},
      {id: '2', shoppingList: '42', title: 'Mehl', amount: 1, unit: 'kg'},
      {id: '3', shoppingList: '42', title: 'Mehl', amount: 1, unit: 'kg'},
      {id: '4', shoppingList: '42', title: 'Mehl', amount: 1, unit: 'kg'},
    ];

    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('.shopping-list__item'));
    expect(listItems.length).toBe(4);
  });

  it('should emit deletion event', fakeAsync(() => {
    const shoppingListItem: ShoppingListItem = {id: '1', title: 'Mehl', amount: 1, unit: 'kg', shoppingList: '42'};
    component.items = [shoppingListItem];

    fixture.detectChanges();

    const hostElement = fixture.nativeElement;
    const label = hostElement.querySelector('.shopping-list__item-text');
    label.click();

    component.itemDeleted.subscribe((item: ShoppingListItem) => {
      expect(item).toEqual(shoppingListItem);
    });

    tick(300);
  }));


  it('should not emit deletion event when unchecked within debounce time', fakeAsync(() => {
    const shoppingListItem: ShoppingListItem = {id: '1', title: 'Mehl', amount: 1, unit: 'kg', shoppingList: '42'};
    component.items = [shoppingListItem];

    fixture.detectChanges();

    spyOn(component.itemDeleted, 'emit');

    const hostElement = fixture.nativeElement;
    const label = hostElement.querySelector('.shopping-list__item-text');
    label.click();
    tick(200);
    label.click();
    tick(100);
    expect(component.itemDeleted.emit).toHaveBeenCalledTimes(0);
  }));


  it('should emit listItemMoved event', fakeAsync(() => {
    component.listItemMoved.subscribe((item: ArrayItemMovedEvent) => {
      expect(item).toEqual({currentIndex: 3, previousIndex: 8});
    });

    component.drop({currentIndex: 3, previousIndex: 8});
  }));
});
