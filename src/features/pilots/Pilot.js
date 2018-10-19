import { Model, attr, fk, oneToOne } from "redux-orm";

export default class Pilot extends Model {
  static modelName = "Pilot";

  static fields = {
    id: attr(),
    name: attr(),
    rank: attr(),
    gunnery: attr(),
    piloting: attr(),
    age: attr(),
    mech: fk("Mech")
  };

  static parse(pilotData) {
    // We could do useful stuff in here with relations,
    // but since we have no relations yet, all we need
    // to do is pass the pilot data on to create()

    // Note that in a static class method, `this` is the
    // class itself, not an instance
    return this.create(pilotData);
  }

  //shallow copy
  toJSON() {
    return {
      ...this.ref
    };
  }

  updateFrom(otherPilot, writeSession) {
    //update one to one relation
    //improve this thing
    if (this.ref.mech !==null && this.ref.mech !== otherPilot.ref.mech) {
      this.mech.updateFrom({ pilot: null });
      const { Mech } = writeSession;
      const mech = Mech.withId(otherPilot.ref.mech);
      mech.pilot.set("mech", null)
      mech.updateFrom({ pilot: this.id, mech: null });
    }

    this.update(otherPilot.ref);
  }
}
