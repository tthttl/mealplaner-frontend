import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ShoppingListComponent } from './shopping-list.component';
import { By } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { ArrayItemMovedEvent, ShoppingListItem } from '../../../shared/model/model';
import { LoginFormComponent } from '../../../auth/components/login-form/login-form.component';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListComponent, TranslatePipe ],
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
      {id: '1', title: 'Mehl', amount: 1, unit: 'kg', isChecked: false},
      {id: '2', title: 'Mehl', amount: 1, unit: 'kg', isChecked: false},
      {id: '3', title: 'Mehl', amount: 1, unit: 'kg', isChecked: false},
      {id: '4', title: 'Mehl', amount: 1, unit: 'kg', isChecked: false},
    ];

    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('.shopping-list__item'));
    expect(listItems.length).toBe(4);
  });

  it('should emit deletion event', () => {
    const shoppingListItem: ShoppingListItem = {id: '1', title: 'Mehl', amount: 1, unit: 'kg', isChecked: false};

    component.items = [
      shoppingListItem
    ];

    fixture.detectChanges();

    component.itemDeleted.subscribe((item: ShoppingListItem) => {
      expect(item).toEqual( {...shoppingListItem});
    });

    const hostElement = fixture.nativeElement;
    const checkbox = hostElement.querySelector('.mat-checkbox-label');
    checkbox.click();
  });


  it('should emit listItemMoved event', fakeAsync(() => {
    component.listItemMoved.subscribe((item: ArrayItemMovedEvent) => {
      expect(item).toEqual( {currentIndex: 3, previousIndex: 8});
    });

    component.drop( {currentIndex: 3, previousIndex: 8});
  }));
});
