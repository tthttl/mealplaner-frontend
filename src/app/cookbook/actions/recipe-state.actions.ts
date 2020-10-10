import { createAction, props } from '@ngrx/store';

export const deleteRecipeFromState = createAction('[Cookbook Container] Delete Recipe from State', props<{ recipeId: string }>());
