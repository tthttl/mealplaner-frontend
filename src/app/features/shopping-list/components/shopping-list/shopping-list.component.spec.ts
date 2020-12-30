import { DragDropModule } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { ArrayItemMovedEvent, ShoppingListItem } from '../../../../core/models/model';

import { ShoppingListComponent } from './shopping-list.component';
import { APP_INITIALIZER, ChangeDetectionStrategy } from '@angular/core';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShoppingListComponent, FaIconComponent, TranslatePipe],
      imports: [DragDropModule, MatCheckboxModule],
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: (iconLibrary: FaIconLibrary) => {
            return async () => {
              iconLibrary.addIconPacks(fas);
            };
          },
          deps: [FaIconLibrary],
          multi: true,
        },
      ]
    })
      .overrideComponent(ShoppingListComponent, {
        set: {changeDetection: ChangeDetectionStrategy.Default}
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
    const label = hostElement.querySelector('.mat-checkbox-label');
    label.click();

    component.shoppingListItemDeleted.subscribe((item: ShoppingListItem) => {
      expect(item).toEqual(shoppingListItem);
    });

    tick(300);
    flush();
  }));


  it('should not emit deletion event when unchecked within debounce time', fakeAsync(() => {
    const shoppingListItem: ShoppingListItem = {id: '1', title: 'Mehl', amount: 1, unit: 'kg', shoppingList: '42'};
    component.items = [shoppingListItem];

    fixture.detectChanges();

    spyOn(component.shoppingListItemDeleted, 'emit');

    const hostElement = fixture.nativeElement;
    const label = hostElement.querySelector('.shopping-list__item-text');
    label.click();
    tick(200);
    label.click();
    tick(100);
    expect(component.shoppingListItemDeleted.emit).toHaveBeenCalledTimes(0);
  }));


  it('should emit listItemMoved event', fakeAsync(() => {
    component.shoppingListItemMoved.subscribe((item: ArrayItemMovedEvent) => {
      expect(item).toEqual({currentIndex: 3, previousIndex: 8});
    });

    component.moveItem({currentIndex: 3, previousIndex: 8});
  }));
});
