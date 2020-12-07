import { createAction, props } from '@ngrx/store';
import { MealPlaner } from '../../../../core/models/model';

export const loadMealPlaners = createAction(
  '[Meal Planer Container] Load Meal Planers'
);

export const selectedDateChanged = createAction(
  '[Meal Planer Container] Selected Date change',
  props<{ selectedDate: Date }>()
);

export const changeSelectedMealPlaner = createAction(
  '[Meal Planer Container] Change Selected Meal Planer',
  props<{ mealPlanerId: string }>()
);

export const createMealPlaner = createAction(
  '[Meal Planer Container] Add Meal Planer',
  props<{ title: string }>()
);

export const deleteMealPlaner = createAction(
  '[Meal Planer Container] Delete Meal Planer',
  props<{ mealPlaner: MealPlaner }>()
);

export const undoDeleteMealPlaner = createAction(
  '[Meal Planer Container] Undo Delete Meal Planer',
  props<{ mealPlaner: MealPlaner }>()
);

export const editMealPlaner = createAction(
  '[Meal Planer Container] Edit Meal Planer',
  props<{ mealPlaner: MealPlaner, changes: MealPlaner }>()
);

