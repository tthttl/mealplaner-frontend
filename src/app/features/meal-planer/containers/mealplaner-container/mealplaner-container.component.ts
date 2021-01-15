import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { DELETION_DELAY } from '../../../../core/constants/constants';
import {
  AddMealDialogEvent,
  CreateListDialogEvent,
  DayPlan,
  EditListDialogEvent,
  I18n,
  Language,
  Meal,
  MealPlaner,
  MealType,
  ShoppingList
} from '../../../../core/models/model';
import { DialogService } from '../../../../core/services/dialog.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import {
  activeDayPlan,
  activeMealPlaner,
  activeMealPlanerId,
  GlobalState,
  isOffline,
  selectCurrentLanguage,
  selectMealPlaners,
  selectSelectedDate,
  selectTranslations
} from '../../../../core/store';
import { EditListDialogComponent } from '../../../../shared/components/edit-list-dialog/edit-list-dialog.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { MealPlanerContainerActions } from '../../store/actions';
import { AddMealDialogComponent } from '../add-meal-dialog/add-meal-dialog.component';


@Component({
  selector: 'app-mealplaner-container',
  templateUrl: './mealplaner-container.component.html',
  styleUrls: ['./mealplaner-container.component.scss'],
})
export class MealplanerContainerComponent implements OnInit {

  selectedDate: Observable<Date | null> = this.store.select(selectSelectedDate);
  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language | null> = this.store.select((state: GlobalState) => state.appState.language);
  dayPlan$: Observable<DayPlan | undefined | null> = this.store.select(activeDayPlan);
  mealPlaners$: Observable<MealPlaner[] | null> = this.store.select(selectMealPlaners);
  activeMealPlaner$: Observable<ShoppingList | undefined> = this.store.select(activeMealPlaner);
  activeMealPlanerId$: Observable<string | undefined> = this.store.select(activeMealPlanerId);
  isOffline$: Observable<boolean> = this.store.select(isOffline);

  private createDialogTranslations: {} = {};
  private editDialogTranslations: {} = {};

  constructor(
    private store: Store<GlobalState>,
    private snackBarService: SnackbarService,
    private dialogService: DialogService,
    private translatePipe: TranslatePipe
  ) {
    this.store.select(selectCurrentLanguage).pipe(
      withLatestFrom(this.store.select(selectTranslations))
    ).subscribe(([currentLanguage, translations]: [Language, I18n | null]) => {
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
    this.store.dispatch(MealPlanerContainerActions.selectedDateChanged({selectedDate}));
  }

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

  onAddMeal(mealType: MealType): void {
    const dialogRef = this.dialogService.openDialog(AddMealDialogComponent, {
      data: {mealType},
      translations: this.editDialogTranslations,
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: AddMealDialogEvent | undefined) => {
        if (result) {
          this.store.dispatch(MealPlanerContainerActions.addMeal({
            optimisticId: uuid(),
            recipe: result.recipe,
            mealType: result.mealType,
            shoppingListItems: result.shoppingListItems
          }));
        }
      });
  }

  onRemoveMeal(meal: Meal): void {
    this.store.dispatch(MealPlanerContainerActions.removeMeal({meal}));
    this.snackBarService.openSnackBar('message.undo', 'message.action', DELETION_DELAY)
      .afterDismissed()
      .pipe(take(1))
      .subscribe(({dismissedByAction}) => {
        if (dismissedByAction) {
          this.store.dispatch(MealPlanerContainerActions.undoRemoveMeal({meal}));
        }
      });
  }
}
