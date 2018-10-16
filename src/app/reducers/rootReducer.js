import {combineReducers} from "redux";
import {reduceReducers} from "common/utils/reducerUtils";

import entitiesReducer from "./entitiesReducer";
import tabReducer from "features/tabs/tabsReducer";
import unitInfoReducer from "features/unitInfo/unitInfoReducer";
import pilotsReducer from "features/pilots/pilotsReducer";
import mechsReducer from "features/mechs/mechsReducer";

import entityCrudReducer from "features/entities/entityReducer";

const combinedReducer = combineReducers({
    unitInfo : unitInfoReducer,
    tabs : tabReducer,
    entities : entitiesReducer,
    pilots : pilotsReducer,
    mechs : mechsReducer
});

const rootReducer = reduceReducers(
    combinedReducer,
    entityCrudReducer,
);
export default rootReducer;
