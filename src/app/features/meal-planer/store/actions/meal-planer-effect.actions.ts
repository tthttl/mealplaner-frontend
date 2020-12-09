import { createAction, props } from '@ngrx/store';
import { Meal, MealPlaner, MealType, Recipe } from '../../../../core/models/model';

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

export const retryAddMeal = createAction(
  '[Meal Planer Effects] Retry Add Meal',
  props<{ mealType: MealType, recipe: Recipe, optimisticId: string }>()
);

export const undoOptimisticAddMeal = createAction(
  '[Meal Planer Effects] Undo Optimistic Add Meal',
  props<{ mealType: MealType, optimisticId: string }>()
);

export const retryRemoveMeal = createAction(
  '[Meal Planer Effects] Retry Delete Meal',
  props<{ meal: Meal }>()
);

export const undoOptimisticRemoveMeal = createAction(
  '[Meal Planer Effects] Undo Optimistic Remove Meal',
  props<{ meal: Meal }>()
);
