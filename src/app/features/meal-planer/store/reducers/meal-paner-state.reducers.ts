import { Action, createReducer, on } from '@ngrx/store';
import { initialMealPlanerState, mealPlanerAdapter, MealPlanerState } from '../state/meal-planer-state';
import { MealPlanerApiActions, MealPlanerContainerActions, MealPlanerEffectActions } from '../actions';
import { formatDate } from '@angular/common';
import { format } from 'date-fns';

export const mealPlanerStateReducers = createReducer<MealPlanerState, Action>(
  initialMealPlanerState,
  on(MealPlanerContainerActions.selectedDateChanged, (state: MealPlanerState, {selectedDate}: { selectedDate: Date }) => {
    return {
      ...state,
      selectedDate
    };
  }),
  on(
    MealPlanerApiActions.loadMealPlanersSuccess,
    (state: MealPlanerState, {mealPlaners}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.addMany(mealPlaners, state.mealPlaners),
      };
    }),
  on(
    MealPlanerEffectActions.setActiveMealPlaner,
    MealPlanerContainerActions.changeSelectedMealPlaner,
    (state: MealPlanerState, {mealPlanerId}) => {
      return {
        ...state,
        activeMealPlaner: mealPlanerId || undefined,
      };
    }),
  on(
    MealPlanerApiActions.createMealPlanerSuccess,
    (state: MealPlanerState, {mealPlaner}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.addOne(mealPlaner, state.mealPlaners),
        meals: {
          ...state.meals,
          [mealPlaner.id]: {},
        },
        activeMealPlaner: mealPlaner.id,
      };
    }
  ),
  on(
    MealPlanerContainerActions.editMealPlaner,
    (state: MealPlanerState, {changes}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.updateOne({id: changes.id, changes}, state.mealPlaners),
      };
    }
  ),
  on(
    MealPlanerEffectActions.undoOptimisticEditMealPlaner,
    (state: MealPlanerState, {mealPlaner}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.updateOne({id: mealPlaner.id, changes: mealPlaner}, state.mealPlaners),
      };
    }
  ),
  on(
    MealPlanerContainerActions.deleteMealPlaner,
    (state: MealPlanerState, {mealPlaner}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.removeOne(mealPlaner.id, state.mealPlaners),
      };
    }
  ),
  on(
    MealPlanerContainerActions.undoDeleteMealPlaner,
    MealPlanerEffectActions.undoOptimisticDeleteMealPlaner,
    (state: MealPlanerState, {mealPlaner}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.addOne(mealPlaner, state.mealPlaners),
      };
    }
  ),
  on(
    MealPlanerApiActions.deleteMealPlanerSuccess,
    (state: MealPlanerState, {mealPlaner}) => {
      const copyMeals = {...state.meals};

      if (copyMeals.hasOwnProperty(mealPlaner.id)) {
        delete copyMeals[mealPlaner.id];
      }

      return {
        ...state,
        meals: copyMeals,
      };
    }
  ),
  on(MealPlanerApiActions.loadMealsSuccess,
    (state: MealPlanerState, {date, dayPlan, mealPlanerId}) => {
      return {
        ...state,
        meals: {
          ...state.meals,
          [mealPlanerId]: {
            ...state.meals[mealPlanerId],
            [format(date, 'yyyy-MM-dd')]: dayPlan
          }
        }
      };
    }
  ),
  on(MealPlanerContainerActions.addMeal,
    (state: MealPlanerState, {optimisticId, mealType, recipe}) => {
      if (!state.activeMealPlaner) {
        return state;
      }

      const date = format(state.selectedDate, 'yyyy-MM-dd');

      return {
        ...state,
        meals: {
          ...state.meals,
          [state.activeMealPlaner]: {
            ...state.meals[state.activeMealPlaner],
            [date]: {
              ...state.meals[state.activeMealPlaner][date],
              [mealType]: [{id: optimisticId, type: mealType, recipe, date}]
            }
          }
        }
      };
    }
  ),
  on(MealPlanerContainerActions.removeMeal,
    (state: MealPlanerState, {meal}) => {
      if (!state.activeMealPlaner) {
        return state;
      }

      const date = format(state.selectedDate, 'yyyy-MM-dd');
      const copyDayPlan = {...state.meals[state.activeMealPlaner][date]};


      if (copyDayPlan.hasOwnProperty(meal.type)) {
        delete copyDayPlan[meal.type];
      }

      return {
        ...state,
        meals: {
          ...state.meals,
          [state.activeMealPlaner]: {
            ...state.meals[state.activeMealPlaner],
            [date]: copyDayPlan
          }
        }
      };
    }
  ),
  on(MealPlanerApiActions.addMealsSuccess,
    (state: MealPlanerState, {optimisticId, mealApi}) => {
      if (!state.activeMealPlaner) {
        return state;
      }

      const date = format(state.selectedDate, 'yyyy-MM-dd');

      return {
        ...state,
        meals: {
          ...state.meals,
          [state.activeMealPlaner]: {
            ...state.meals[state.activeMealPlaner],
            [date]: {
              ...state.meals[state.activeMealPlaner][date],
              [mealApi.type]: state.meals[state.activeMealPlaner][date][mealApi.type].map(meal => {
                return meal.id === optimisticId ? {...meal, id: mealApi.id} : meal;
              })
            }
          }
        }
      };
    }
  ),
  on(MealPlanerEffectActions.undoOptimisticAddMeal,
    (state: MealPlanerState, {optimisticId, mealType}) => {
      if (!state.activeMealPlaner) {
        return state;
      }

      const date = format(state.selectedDate, 'yyyy-MM-dd');

      return {
        ...state,
        meals: {
          ...state.meals,
          [state.activeMealPlaner]: {
            ...state.meals[state.activeMealPlaner],
            [date]: {
              ...state.meals[state.activeMealPlaner][date],
              [mealType]: state.meals[state.activeMealPlaner][date][mealType].filter(meal => {
                return meal.id !== optimisticId;
              })
            }
          }
        }
      };
    }
  ),
  on(MealPlanerContainerActions.undoRemoveMeal,
    MealPlanerEffectActions.undoOptimisticRemoveMeal,
    (state: MealPlanerState, {meal}) => {
      if (!state.activeMealPlaner) {
        return state;
      }

      const date = format(state.selectedDate, 'yyyy-MM-dd');

      return {
        ...state,
        meals: {
          ...state.meals,
          [state.activeMealPlaner]: {
            ...state.meals[state.activeMealPlaner],
            [date]: {
              ...state.meals[state.activeMealPlaner][date],
              [meal.type]: [...(state.meals[state.activeMealPlaner][date][meal.type] || []), meal]
            }
          }
        }
      };
    }
  )
);
