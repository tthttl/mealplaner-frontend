import { mealPlanerStateReducers } from './meal-planer-state.reducers';
import { initialMealPlanerState } from '../state/meal-planer-state';
import { MealPlanerApiActions, MealPlanerContainerActions, MealPlanerEffectActions } from '../actions';
import { DayPlan, Meal, MealPlaner, Recipe } from '../../../../core/models/model';

describe('mealPlanerReducers', () => {
  describe('MealPlanerContainerActions.selectedDateChanged', () => {
    it('should change selected Date', () => {
      const date = new Date();

      expect(mealPlanerStateReducers({...initialMealPlanerState}, MealPlanerContainerActions.selectedDateChanged({
        selectedDate: date,
      }))).toEqual({
        ...initialMealPlanerState,
        selectedDate: date,
      });
    });
  });

  describe('MealPlanerApiActions.loadMealPlanersSuccess', () => {
    it('should add meal planers', () => {
      const mealPlaners: MealPlaner[] = [{id: '1', title: 'Mealplaner 1'}, {id: '2', title: 'Mealplaner 2'}];

      expect(mealPlanerStateReducers({...initialMealPlanerState}, MealPlanerApiActions.loadMealPlanersSuccess({
        mealPlaners,
      }))).toEqual({
        ...initialMealPlanerState,
        mealPlaners: {
          ids: ['1', '2'],
          entities: {
            1: {id: '1', title: 'Mealplaner 1'},
            2: {id: '2', title: 'Mealplaner 2'}
          },
        }
      });
    });
  });

  describe('MealPlanerEffectActions.setActiveMealPlaner', () => {
    it('should set active meal planers', () => {

      expect(mealPlanerStateReducers({...initialMealPlanerState}, MealPlanerEffectActions.setActiveMealPlaner({
        mealPlanerId: '42',
      }))).toEqual({
        ...initialMealPlanerState,
        activeMealPlaner: '42'
      });
    });
  });

  describe('MealPlanerApiActions.createMealPlanerSuccess', () => {
    it('should add created meal planer', () => {

      expect(mealPlanerStateReducers({
        ...initialMealPlanerState
      }, MealPlanerApiActions.createMealPlanerSuccess({
        mealPlaner: {id: '42', title: 'Created Meal Planer'},
      }))).toEqual({
        ...initialMealPlanerState,
        activeMealPlaner: '42',
        meals: {
          42: {},
        },
        mealPlaners: {
          ids: ['42'],
          entities: {
            42: {id: '42', title: 'Created Meal Planer'}
          }
        }
      });
    });
  });

  describe('MealPlanerContainerActions.editMealPlaner', () => {
    it('should edit mealplaner', () => {

      expect(mealPlanerStateReducers({
        ...initialMealPlanerState,
        activeMealPlaner: '42',
        meals: {
          42: {},
        },
        mealPlaners: {
          ids: ['42'],
          entities: {
            42: {id: '42', title: 'Meal Planer'}
          }
        }
      }, MealPlanerContainerActions.editMealPlaner({
        changes: {id: '42', title: 'Updated'}, mealPlaner: {id: '42', title: 'Meal Planer'},
      }))).toEqual({
        ...initialMealPlanerState,
        activeMealPlaner: '42',
        meals: {
          42: {},
        },
        mealPlaners: {
          ids: ['42'],
          entities: {
            42: {id: '42', title: 'Updated'}
          }
        }
      });
    });
  });

  describe('MealPlanerApiActions.deleteMealPlanerSuccess,', () => {
    it('should delete meals from meal planer', () => {

      expect(mealPlanerStateReducers({
        ...initialMealPlanerState,
        activeMealPlaner: '42',
        meals: {
          42: {},
        },
        mealPlaners: {
          ids: [],
          entities: {}
        }
      }, MealPlanerApiActions.deleteMealPlanerSuccess({
        mealPlaner: {id: '42', title: 'Meal Planer'},
      }))).toEqual({
        ...initialMealPlanerState,
        activeMealPlaner: '42',
        meals: {},
        mealPlaners: {
          ids: [],
          entities: {}
        }
      });
    });
  });

  describe('MealPlanerApiActions.loadMealsSuccess', () => {
    it('should add meals', () => {

      expect(mealPlanerStateReducers({
        ...initialMealPlanerState,
        activeMealPlaner: '42',
        meals: {
          42: {},
        },
        mealPlaners: {
          ids: ['42'],
          entities: {
            42: {id: '42', title: 'Meal Planer'}
          }
        }
      }, MealPlanerApiActions.loadMealsSuccess({
        date: new Date('01-01-2021'), mealPlanerId: '42', dayPlan: {breakfast: [], lunch: [], dinner: []},
      }))).toEqual({
        ...initialMealPlanerState,
        activeMealPlaner: '42',
        meals: {
          42: {
            '2021-01-01': {breakfast: [], lunch: [], dinner: []}
          },
        },
        mealPlaners: {
          ids: ['42'],
          entities: {
            42: {id: '42', title: 'Meal Planer'}
          }
        }
      });
    });
  });

  describe('MealPlanerContainerActions.removeMeal', () => {
    it('should remove meals', () => {

      expect(mealPlanerStateReducers({
        ...initialMealPlanerState,
        activeMealPlaner: '42',
        selectedDate: new Date('01-01-2021'),
        meals: {
          42: {
            '2021-01-01': {
              breakfast: [{id: '42', type: 'breakfast', recipe: {} as Recipe, date: '2021-01-01'}],
              lunch: [],
              dinner: []
            }
          },
        },
        mealPlaners: {
          ids: ['42'],
          entities: {
            42: {id: '42', title: 'Meal Planer'}
          }
        }
      }, MealPlanerContainerActions.removeMeal({
        meal: {id: '42', type: 'breakfast', recipe: {} as Recipe, date: '2021-01-01'},
      }))).toEqual({
        ...initialMealPlanerState,
        activeMealPlaner: '42',
        selectedDate: new Date('01-01-2021'),
        meals: {
          42: {
            '2021-01-01': {breakfast: [], lunch: [], dinner: []}
          },
        },
        mealPlaners: {
          ids: ['42'],
          entities: {
            42: {id: '42', title: 'Meal Planer'}
          }
        }
      });
    });
  });
});
