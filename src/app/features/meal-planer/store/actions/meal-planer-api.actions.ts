import { createAction, props } from '@ngrx/store';
import { MealPlaner } from '../../../../core/models/model';

export const loadMealPlanersSuccess = createAction(
  '[Meal Planer API] Load Meal Planers Success',
  props<{ mealPlaners: MealPlaner[] }>()
);
export const loadMealPlanersFailure = createAction('[Meal Planer API] Load Meal Planers Failure');

export const createMealPlanerSuccess = createAction(
  '[Meal Planer API] Create Meal Planer Success',
  props<{ mealPlaner: MealPlaner }>()
);

export const createMealPlanerFailure = createAction(
  '[Meal Planer API] Create Meal Planer Failure',
  props<{ title: string }>()
);

export const deleteMealPlanerSuccess = createAction(
  '[Meal Planer API] Delete Meal Planer Success',
  props<{ mealPlaner: MealPlaner }>()
);

export const deleteMealPlanerFailure = createAction(
  '[Meal Planer API] Delete Meal Planer Failure',
  props<{ mealPlaner: MealPlaner }>()
);

export const editMealPlanerSuccess = createAction(
  '[Meal Planer API] Edit Meal Planer Success',
  props<{ mealPlaner: MealPlaner }>()
);

export const editMealPlanerFailure = createAction(
  '[Meal Planer API] Edit Meal Planer Failure',
  props<{ changes: MealPlaner, mealPlaner: MealPlaner }>()
);
