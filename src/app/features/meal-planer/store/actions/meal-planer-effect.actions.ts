import { createAction, props } from '@ngrx/store';
import { MealPlaner } from '../../../../core/models/model';

export const setActiveMealPlaner = createAction(
  '[Meal Planer Effects] Set Active Meal Planer',
  props<{ mealPlanerId: string }>()
);

export const retryCreateMealPlaner = createAction(
  '[Meal Planer Effects] Retry Create Meal Planer',
  props<{ title: string }>()
);

export const retryDeleteMealPlaner = createAction(
  '[Meal Planer Effects] Retry Delete Meal Planer',
  props<{ mealPlaner: MealPlaner }>()
);

export const undoOptimisticDeleteMealPlaner = createAction(
  '[Meal Planer Effects] Undo Optimistic Delete Meal Planer',
  props<{ mealPlaner: MealPlaner }>()
);

export const retryEditMealPlaner = createAction(
  '[Meal Planer Effects] Retry Edit Meal Planer',
  props<{ mealPlaner: MealPlaner, changes: MealPlaner }>()
);

export const undoOptimisticEditMealPlaner = createAction(
  '[Meal Planer Effects] Undo Optimistic Edit Meal Planer',
  props<{ mealPlaner: MealPlaner }>()
);
