/**
 ** Improve performance considering how connect uses mapState
 ** Shold not use .map functions inside mapState and return new objects.
 ** Same references should be returned when nothing changes to avoid re rendering
 ** wasting resources.
 ** Dont create new data structures references.
 **/

import React, { Component } from "react";
import { connect } from "react-redux";
import { Table } from "semantic-ui-react";

import PilotsListHeader from "./PilotsListHeader";
import PilotsListRow from "./PilotsListRow";

import {getEntitiesSession} from "features/entities/entitySelectors";

import * as actions from "../pilotsActions";
import { selectCurrentPilot } from "../pilotsSelectors";

const mapState = state => {
  // Create a Redux-ORM Session from our "entities" slice, which
  // contains the "tables" for each model type

  const session = getEntitiesSession(state);

  // Retrieve the model class that we need.  Each Session
  // specifically "binds" model classes to itself, so that
  // updates to model instances are applied to that session.
  // These "bound classes" are available as fields in the sesssion.
  const { Pilot } = session;

  // Query the session for all Pilot instances.
  // The QuerySet that is returned from all() can be used to
  // retrieve instances of the Pilot class, or retrieve the
  // plain JS objects that are actually in the store.

  // The withModels modifier will let us map over Model instances
  // for each entry, rather than the plain JS objects.

  // Extract a list of IDs for all
  const pilots = Pilot.all()
    .toModelArray()
    .map(pilotModel => pilotModel.getId());

  const currentPilot = selectCurrentPilot(state);

  // Now that we have an array of all pilot objects, return it as a prop
  return { pilots, currentPilot };
};

export class PilotsList extends Component {
  render() {
    const { pilots, selectPilot, currentPilot } = this.props;

    const pilotRows = pilots.map(pilotID => (
      <PilotsListRow
        pilotID={pilotID}
        key={pilotID}
        onPilotClicked={selectPilot}
        selected={pilotID === currentPilot}
      />
    ));

    return (
      <Table celled>
        <PilotsListHeader />
        <Table.Body>{pilotRows}</Table.Body>
      </Table>
    );
  }
}

export default connect(mapState, actions)(PilotsList);
