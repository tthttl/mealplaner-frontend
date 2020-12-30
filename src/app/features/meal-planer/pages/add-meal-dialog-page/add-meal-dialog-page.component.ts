import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BasicShoppingListItem, Cookbook, I18n, Language, MealPlanerAddEvent, Recipe, ShoppingList } from '../../../../core/models/model';

@Component({
  selector: 'app-add-meal-dialog-page',
  templateUrl: './add-meal-dialog-page.component.html',
  styleUrls: ['./add-meal-dialog-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMealDialogPageComponent implements OnInit {
  @Input() recipes: { [key: string]: Recipe[] } | null | undefined = undefined;
  @Input() translations: I18n | null = null;
  @Input() currentLanguage: Language | null = null;
  @Input() preSelectedCookbookId: string | null | undefined = undefined;
  @Input() preSelectedShoppingListId: string | null | undefined = undefined;
  @Input() cookbooks: Cookbook[] | null = null;
  @Input() shoppingLists: ShoppingList[] | undefined | null = null;
  @Output() addRecipe: EventEmitter<MealPlanerAddEvent> = new EventEmitter();
  @Output() changeSelectedCookbook: EventEmitter<string> = new EventEmitter();

  selectedRecipe: Recipe | undefined = undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  onSelectRecipe(recipe: Recipe): void {
    this.selectedRecipe = recipe;
  }

  onSelectedCookbookChanged(id: string): void {
    this.changeSelectedCookbook.emit(id);
  }

  onChoseIngredients(shoppingListItems: BasicShoppingListItem[]): void {
    if (this.selectedRecipe) {
      this.addRecipe.emit({recipe: this.selectedRecipe, shoppingListItems});
    }
  }

  onGoBack(): void {
    this.selectedRecipe = undefined;
  }
}
