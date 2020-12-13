import { createAction, props } from '@ngrx/store';
import { DayPlan, Meal, MealPlaner, MealType, Recipe } from '../../../../core/models/model';

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

export const loadMealsSuccess = createAction(
  '[Meal Planer API] Load Meals Success',
  props<{ mealPlanerId: string, date: Date, dayPlan: DayPlan }>()
);

export const loadMealsFailure = createAction(
  '[Meal Planer API] Load Meals Failure'
);

export const addMealsSuccess = createAction(
  '[Meal Planer API] Add Meal Success',
  props<{ mealApi: Meal, optimisticId: string }>()
);

export const addMealsFailure = createAction(
  '[Meal Planer API] Add Meal Failure',
  props<{ mealType: MealType, recipe: Recipe, optimisticId: string }>()
);


export const removeMealsSuccess = createAction(
  '[Meal Planer API] Remove Meal Success',
);

export const removeMealsFailure = createAction(
  '[Meal Planer API] Remove Meal Failure',
  props<{ meal: Meal }>()
);
