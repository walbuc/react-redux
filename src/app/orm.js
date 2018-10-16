import {ORM} from "redux-orm";
import Pilot from "features/pilots/Pilot";
import MechDesign from "features/mechs/MechDesign";
import Mech from "features/mechs/Mech";

//Create orm instance with models types.
//This is a singleton.

const orm = new ORM();
orm.register(Pilot, MechDesign, Mech);

export default orm;
