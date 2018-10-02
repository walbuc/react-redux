import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from "redux-thunk";
import rootReducer from "../reducers/rootReducer";

export default function configureStore(preloadedState) {
  const middlewares = [thunk];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const storeEnhancers = [middlewareEnhancer];

  const composedEnhancer = composeWithDevTools(...storeEnhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancer);

  //Listen for updates to the root reducer file,
  //re-import it, and then replace the old reducer in the store with the new one.
  if(process.env.NODE_ENV !== "production") {
       if(module.hot) {
           module.hot.accept("../reducers/rootReducer", () =>{
               const newRootReducer = require("../reducers/rootReducer").default;
               store.replaceReducer(newRootReducer)
           });
       }
   }

  return store;
}
