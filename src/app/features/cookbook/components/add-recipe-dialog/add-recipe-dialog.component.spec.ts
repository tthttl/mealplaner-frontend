import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogData, Recipe } from '../../../../core/models/model';
import { SharedModule } from '../../../../shared/shared.module';

import { AddRecipeDialogComponent } from './add-recipe-dialog.component';

describe('RecipeViewComponent', () => {
  let component: AddRecipeDialogComponent;
  let fixture: ComponentFixture<AddRecipeDialogComponent>;

  const dialogData: DialogData<Recipe> = {
    data: {
      id: '1',
      title: 'title',
      cookbookId: 'cookbookId',
      ingredients: [
        {
          amount: 1,
          unit: 'kg',
          title: 'ingredient',
          isStapleFood: false
        }
      ]
    },
    translations: {
      'ingredients.label-text': 'test'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, SharedModule],
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
    const ingredientColumns = fixture.nativeElement.querySelectorAll('.ingredient-column');
    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(title.innerHTML).toEqual('test');
    expect(ingredientColumns?.length).toEqual(3);
    expect(buttons?.length).toEqual(2);
    [...ingredientColumns]
      .map((column) => column.innerHTML)
      .forEach((value: string) => expect([
        dialogData.data.ingredients[0].amount.toString(),
        dialogData.data.ingredients[0].title,
        dialogData.data.ingredients[0].unit,
      ]).toContain(value));
  });
});
