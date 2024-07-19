import { encryptTransform } from 'redux-persist-transform-encrypt';
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import adminTab from './tabs/admin-tab';
import clientTab from './tabs/client-tabs';

const rootReducer = combineReducers({
    adminTemplate: adminTab,
    clientTemplate: clientTab
})

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    transform: [
        encryptTransform({
            secretKey: 'redux-key',
            onError: (err) => {
                console.log(err)
            }
        })
    ]
}

export type RootState = ReturnType<typeof rootReducer>

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
  });
  
  export const persistor = persistStore(store);