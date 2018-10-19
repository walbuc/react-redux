import React from "react";
import { connect } from "react-redux";
import { Table } from "semantic-ui-react";

import {getEntitiesSession} from "features/entities/entitySelectors";
import { getWeightClass } from "../mechsSelectors";

const mapState = (state, ownProps) => {
  const session = getEntitiesSession(state)
  const { Mech } = session;

  let mech;

  if (Mech.hasId(ownProps.mechID)) {
    const mechModel = Mech.withId(ownProps.mechID);

    mech = {
      // Copy the data from the plain JS object
      ...mechModel.ref,
      // Provide a default empty object for the relation
      mechType: {},
      pilot: {}
    };

    if (mechModel.type) {
      // Replace the default object with a copy of the relation's data
      mech.mechType = { ...mechModel.type.ref };
    }
    if( mechModel.pilot ) {
      mech.pilot = { ...mechModel.pilot.ref };
    }
  }

  return { mech };
};

export const MechsListRow = ({ mech, onMechClicked, selected }) => {
  const { id = null, type = "", mechType = {}, pilot = {} } = mech;

  const { name = "", weight = "" } = mechType;


  const weightClass = getWeightClass(weight);

  return (
    <Table.Row onClick={() => onMechClicked(id)} active={selected}>
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>{type}</Table.Cell>
      <Table.Cell>{weight}</Table.Cell>
      <Table.Cell>{weightClass}</Table.Cell>
      <Table.Cell>{pilot.name}</Table.Cell>
    </Table.Row>
  );
};

export default connect(mapState)(MechsListRow);
