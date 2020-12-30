import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Cookbook, DialogData, I18n, Language, MealPlanerAddEvent, Recipe, ShoppingList, User } from '../../../../core/models/model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-account-confirmation-dialog-page',
  templateUrl: './delete-account-confirmation-dialog-page.component.html',
  styleUrls: ['./delete-account-confirmation-dialog-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteAccountConfirmationDialogPageComponent implements OnInit {
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
  confirmInput = '';

  get isConfirmed(): boolean {
    return this.confirmInput === this.dialogData.data.name;
  }

  constructor(public dialogRef: MatDialogRef<DeleteAccountConfirmationDialogPageComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<User>) {
  }

  ngOnInit(): void {
    console.log(this.dialogData);
  }

  confirm(): void {
    this.dialogRef.close({
      confirmed: true,
    });
  }

  discard(): void {
    this.dialogRef.close({
      confirmed: false,
    });
  }
}
