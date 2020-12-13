import { createAction, props } from '@ngrx/store';

export const setOfflineMode = createAction('[SyncService] Set Offline Mode', props<{isOffline: boolean}>());

