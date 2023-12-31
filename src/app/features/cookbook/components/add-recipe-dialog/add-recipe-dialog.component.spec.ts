import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogData, Recipe, ShoppingList } from '../../../../core/models/model';
import { SharedModule } from '../../../../shared/shared.module';

import { AddRecipeDialogComponent } from './add-recipe-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('RecipeViewComponent', () => {
  let component: AddRecipeDialogComponent;
  let fixture: ComponentFixture<AddRecipeDialogComponent>;

  const dialogData: DialogData<{recipe: Recipe, shoppingLists: ShoppingList[], activeShoppingList: string}> = {
    data: {
      shoppingLists: [{id: 'shoppingLists', title: ''}],
      activeShoppingList: 'shoppingLists',
      recipe: {
        ingredients: [
          {
            amount: 1,
            unit: 'kg',
            title: 'ingredient',
            isStapleFood: false
          }
        ]
      } as Recipe
    },
    translations: {
      'ingredients.label-text': 'test',
      kg: 'kg'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, SharedModule, ReactiveFormsModule, MatCheckboxModule],
      declarations: [AddRecipeDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecipeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display dialogData', () => {
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('h4');
    const ingredientColumns = fixture.nativeElement.querySelectorAll('.ingredient-dialog__list-column');
    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(title.innerHTML).toEqual('test');
    expect(ingredientColumns?.length).toEqual(2);
    expect(buttons?.length).toEqual(1);
    const result = [...ingredientColumns]
      .map((column) => column.innerHTML)
      .reduce((previous: string, current: string) => previous + ' ' + current);
    expect(result).toEqual(dialogData.data.recipe.ingredients[0].amount.toString() + ' '
      + dialogData.data.recipe.ingredients[0].unit + ' ' + dialogData.data.recipe.ingredients[0].title);
  });
});
