import {Model, fk, attr, oneToOne} from "redux-orm";

export default class Mech extends Model {
    static modelName = "Mech";

    static fields = {
        id : attr(),
        type : fk("MechDesign"),
        pilot: fk("Pilot")
    };

    static parse(mechData) {
        return this.create(mechData);
    }

    toJSON() {
      return {
        ...this.ref,
          type: this.type.toJSON(),
      }
    }

    updateFrom(newMech) {
      this.update(newMech);
    }
}
