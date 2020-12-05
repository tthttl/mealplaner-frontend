import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  activeMealPlaner,
  activeMealPlanerId,
  GlobalState,
  selectMealPlaners,
  selectSelectedDate,
  selectTranslations
} from '../../../../core/store';
import { Observable } from 'rxjs';
import { MealPlanerContainerActions } from '../../store/actions';
import { CreateListDialogEvent, EditListDialogEvent, I18n, Language, MealPlaner, ShoppingList } from '../../../../core/models/model';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { take, withLatestFrom } from 'rxjs/operators';
import { EditListDialogComponent } from '../../../../shared/components/edit-list-dialog/edit-list-dialog.component';
import { DELETION_DELAY } from '../../../../core/constants/constants';

@Component({
  selector: 'app-mealplaner-container',
  templateUrl: './mealplaner-container.component.html',
  styleUrls: ['./mealplaner-container.component.scss'],
})
export class MealplanerContainerComponent implements OnInit {

  selectedDate: Observable<Date | null> = this.store.select(selectSelectedDate);
  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language | null> = this.store.select((state: GlobalState) => state.appState.language);
  // meals$: Observable<Meal[] | undefined | null> = this.store.select(selectCurrentMealPlanerMeals);
  mealPlaners$: Observable<ShoppingList[] | null> = this.store.select(selectMealPlaners);
  activeMealPlaner$: Observable<ShoppingList | undefined> = this.store.select(activeMealPlaner);
  activeMealPlanerId$: Observable<string | undefined> = this.store.select(activeMealPlanerId);

  private createDialogTranslations: {} = {};
  private editDialogTranslations: {} = {};

  constructor(
    private store: Store<GlobalState>,
    private snackBarService: SnackbarService,
    private dialogService: DialogService,
    private translatePipe: TranslatePipe
  ) {
    this.store.select(selectTranslations).pipe(
      withLatestFrom(this.store.select((state: GlobalState) => state.appState.language))
    ).subscribe(([translations, currentLanguage]: [I18n | null, Language]) => {
      this.createDialogTranslations = {
        title: this.translatePipe.transform('create-meal-planer.heading', translations, currentLanguage),
        'save-button-text': this.translatePipe.transform('create-meal-planer.save-button-text', translations, currentLanguage),
        'cancel-button-text': this.translatePipe.transform('create-meal-planer.cancel-button-text', translations, currentLanguage),
        placeholder: this.translatePipe.transform('create-meal-planer.placeholder', translations, currentLanguage),
      };

      this.editDialogTranslations = {
        title: this.translatePipe.transform('edit-meal-planer.title', translations, currentLanguage),
        'save-button-text': this.translatePipe.transform('edit-meal-planer.save-button-text', translations, currentLanguage),
        'cancel-button-text': this.translatePipe.transform('edit-meal-planer.cancel-button-text', translations, currentLanguage),
        placeholder: this.translatePipe.transform('edit-meal-planer.placeholder', translations, currentLanguage),
      };
    });
  }

  ngOnInit(): void {
    this.store.dispatch(MealPlanerContainerActions.loadMealPlaners());
  }

  onWeekOffsetChanged(selectedDate: Date): void {
    console.log('here', selectedDate);

    this.store.dispatch(MealPlanerContainerActions.selectedDateChanged({selectedDate}));
  }

  /*
  onMealAdded(meal: Meal): void {
    this.store.dispatch(ShoppingListContainerActions.addShoppingListItem({optimisticId: uuid(), shoppingListItem}));
  }
   */

  onMealPlanerChange(mealPlaner: MealPlaner): void {
    this.store.dispatch(MealPlanerContainerActions.changeSelectedMealPlaner({mealPlanerId: mealPlaner.id}));
  }

  onMealPlanerCreate(): void {
    const dialogRef = this.dialogService.openDialog(EditListDialogComponent, {
      data: {},
      translations: this.createDialogTranslations,
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: CreateListDialogEvent | undefined) => {
        if (result?.event === 'create') {
          this.store.dispatch(MealPlanerContainerActions.createMealPlaner({title: result.title}));
        }
      });
  }

  onMealPlanerDeleted(mealPlaner: MealPlaner): void {
    this.store.dispatch(MealPlanerContainerActions.deleteMealPlaner({mealPlaner}));
    this.snackBarService.openSnackBar('message.undo', 'message.action', DELETION_DELAY)
      .afterDismissed()
      .pipe(take(1))
      .subscribe(({dismissedByAction}) => {
        if (dismissedByAction) {
          this.store.dispatch(MealPlanerContainerActions.undoDeleteMealPlaner({mealPlaner}));
        }
      });
  }

  onMealPlanerEdit(mealPlaner: MealPlaner): void {
    const dialogRef = this.dialogService.openDialog(EditListDialogComponent, {
      data: mealPlaner,
      translations: this.editDialogTranslations,
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: EditListDialogEvent | undefined) => {
        if (result?.event === 'edit') {
          this.store.dispatch(MealPlanerContainerActions.editMealPlaner({mealPlaner, changes: result.list}));
        }
      });

  }
}
