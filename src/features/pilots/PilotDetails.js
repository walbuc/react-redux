import React, { Component } from "react";
import { Form, Dropdown, Grid, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import orm from "app/orm";
import { selectCurrentPilot, selectIsEditingPilot } from "./pilotsSelectors";
import * as actions from "./pilotsActions";

const RANKS = [
  { value: "Private", text: "Private" },
  { value: "Corporal", text: "Corporal" },
  { value: "Sergeant", text: "Sergeant" },
  { value: "Lieutenant", text: "Lieutenant" },
  { value: "Captain", text: "Captain" },
  { value: "Major", text: "Major" },
  { value: "Colonel", text: "Colonel" }
];

const MECHS = [{ value: "WHM-6R", text: "Warhammer WHM-6R" }];

const SKILL_VALUES = [
  { value: 0, text: 0 },
  { value: 1, text: 1 },
  { value: 2, text: 2 },
  { value: 3, text: 3 },
  { value: 4, text: 4 },
  { value: 5, text: 5 },
  { value: 6, text: 6 },
  { value: 7, text: 7 },
  { value: 8, text: 8 }
];

export class PilotDetails extends Component {
  render() {
    const {
      pilot = {},
      pilotIsSelected = false,
      isEditingPilot = false
    } = this.props;
    const { startEditingPilot, stopEditingPilot } = this.props;

    const {
      name = "",
      rank = "",
      age = "",
      gunnery = "",
      piloting = "",
      mechType = ""
    } = pilot;

    const canStartEditing = pilotIsSelected && !isEditingPilot;
    const canStopEditing = pilotIsSelected && isEditingPilot;

    return (
      <Form size="large">
        <Form.Field
          name="name"
          label="Name"
          width={16}
          placeholder="Name"
          value={name}
          disabled={!canStopEditing}
          control="input"
        />
        <Form.Field
          name="rank"
          label="Rank"
          width={16}
          control={Dropdown}
          fluid
          selection
          options={RANKS}
          value={rank}
          disabled={!canStopEditing}
        />
        <Form.Field
          name="age"
          width={6}
          label="Age"
          placeholder="Age"
          control="input"
          value={age}
          disabled={!canStopEditing}
        />
        <Form.Field
          name="gunnery"
          label="Gunnery"
          width={6}
          control={Dropdown}
          fluid
          selection
          options={SKILL_VALUES}
          value={gunnery}
          disabled={!canStopEditing}
        />
        <Form.Field
          name="piloting"
          label="Piloting"
          width={6}
          control={Dropdown}
          fluid
          selection
          options={SKILL_VALUES}
          value={piloting}
          disabled={!canStopEditing}
        />
        <Form.Field
          name="mech"
          label="Mech"
          width={16}
          control={Dropdown}
          fluid
          selection
          options={MECHS}
          value={mechType}
          disabled={true}
        />
        <Grid.Row width={16}>
          <Button
            primary
            disabled={!canStartEditing}
            type="button"
            onClick={startEditingPilot}
          >
            Start Editing
          </Button>
          <Button
            secondary
            disabled={!canStopEditing}
            type="button"
            onClick={stopEditingPilot}
          >
            Stop Editing
          </Button>
        </Grid.Row>
      </Form>
    );
  }
}

//Create something more FUNCTIONAL
// here we have not wasted re renderings
const mapState = state => {
  let pilot;

  const currentPilot = selectCurrentPilot(state);

  const session = orm.session(state.entities);
  const { Pilot } = session;

  if (Pilot.hasId(currentPilot)) {
    pilot = Pilot.withId(currentPilot).ref;
  }

  const pilotIsSelected = Boolean(currentPilot);
  const isEditingPilot = selectIsEditingPilot(state);

  return { pilot, pilotIsSelected, isEditingPilot };
};

export default connect(mapState, actions)(PilotDetails);