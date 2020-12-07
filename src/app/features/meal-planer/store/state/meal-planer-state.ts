import { createEntityAdapter } from '@ngrx/entity';
import { Meal, MealPlaner } from '../../../../core/models/model';
import { EntityState } from '@ngrx/entity/src/models';

export const mealPlanerAdapter = createEntityAdapter<MealPlaner>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});


export interface MealPlanerState {
  readonly selectedDate: Date;
  readonly mealPlaners: EntityState<MealPlaner>;
  readonly meals: { [key: string]: {[key: string]: Meal[]} };
  readonly activeMealPlaner: string | undefined;
}

export const initialMealPlanerState: MealPlanerState = {
  selectedDate: new Date(),
  mealPlaners: mealPlanerAdapter.getInitialState(),
  meals: {},
  activeMealPlaner: undefined,
};

