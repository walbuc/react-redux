import React, { Component } from "react";
import { Form, Dropdown, Grid, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { selectCurrentPilot, selectIsEditingPilot } from "./pilotsSelectors";
import {
  startEditingPilot,
  stopEditingPilot,
  cancelEditingPilot
} from "./pilotsActions";
import { editItemAttributes } from "features/editing/editingActions";
import { getValueFromEvent } from "common/utils/clientUtils";
import FormEditWrapper from "common/components/FormEditWrapper";

import { getEntitiesSession } from "features/entities/entitySelectors";
import { getEditingEntitiesSession } from "features/editing/editingSelectors";
import { resetEditedItem } from "features/editing/editingActions";

const actions = {
  startEditingPilot,
  stopEditingPilot,
  editItemAttributes,
  cancelEditingPilot,
  resetEditedItem
};

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
  onInputChanged = e => {
    const newValues = getValueFromEvent(e);
    const { id } = this.props.pilot;
    //Model type id and values to be updated
    this.props.editItemAttributes("Pilot", id, newValues);
  };

  onDropdownChanged = (e, result) => {
    const { name, value } = result;
    const newValues = { [name]: value };
    const { id } = this.props.pilot;

    this.props.editItemAttributes("Pilot", id, newValues);
  };

  onStartEditingClicked = () => {
    this.props.startEditingPilot();
  };

  onStopEditingClicked = () => {
    this.props.stopEditingPilot();
  };

  onResetClicked = () => {
    const { id } = this.props.pilot;
    this.props.resetEditedItem("Pilot", id);
  };

  render() {
    const {
      pilot = {},
      pilotIsSelected = false,
      isEditingPilot = false,
      mechs = []
    } = this.props;
    const { startEditingPilot, stopEditingPilot } = this.props;
    const buttonWidth = 140;
    const {
      name = "",
      rank = "",
      age = "",
      gunnery = "",
      piloting = "",
      mech = ""
    } = pilot;

    const canStartEditing = pilotIsSelected && !isEditingPilot;
    const canStopEditing = pilotIsSelected && isEditingPilot;

    const displayMechs = mechs.map(mech => {
      return {
        value: mech.id,
        text: mech.type.name
      };
    });

    return (
      <Form size="large">
        <FormEditWrapper
          singleValue={true}
          value={{ name }}
          onChange={this.onInputChanged}
          passIsEditing={false}
        >
          <Form.Field
            name="name"
            label="Name"
            width={16}
            placeholder="Name"
            disabled={!canStopEditing}
            control="input"
            style={{ width: buttonWidth, marginRight: 10 }}
          />
        </FormEditWrapper>

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
          onChange={this.onDropdownChanged}
        />
        <FormEditWrapper
          singleValue={true}
          value={{ age }}
          onChange={this.onInputChanged}
          passIsEditing={false}
        >
          <Form.Field
            name="age"
            width={6}
            label="Age"
            placeholder="Age"
            control="input"
            disabled={!canStopEditing}
          />
        </FormEditWrapper>
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
          onChange={this.onDropdownChanged}
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
          onChange={this.onDropdownChanged}
        />
        <Form.Field
          name="mech"
          label="Mech"
          width={16}
          control={Dropdown}
          fluid
          selection
          options={displayMechs}
          value={mech}
          disabled={!canStopEditing}
          onChange={this.onDropdownChanged}
        />
        <Grid.Row width={16}>
          <Button
            primary
            disabled={!canStartEditing}
            type="button"
            onClick={this.onStartEditingClicked}
            style={{ width: buttonWidth, marginRight: 10 }}
          >
            Start Editing
          </Button>
          <Button
            secondary
            disabled={!canStopEditing}
            type="button"
            onClick={this.onStopEditingClicked}
            style={{ width: buttonWidth }}
          >
            Save Editing
          </Button>
        </Grid.Row>
        <Grid.Row width={16}>
          <Button
            disabled={!canStopEditing}
            type="button"
            onClick={this.onResetClicked}
            style={{ width: buttonWidth, marginRight: 10 }}
          >
            Reset Values
          </Button>
          <Button
            negative
            disabled={!canStopEditing}
            type="button"
            style={{ width: buttonWidth }}
            onClick={this.props.cancelEditingPilot}
            style= {{width: buttonWidth}}
          >
            Cancel Edits
          </Button>
        </Grid.Row>
      </Form>
    );
  }
}

//Create something more FUNCTIONAL
// here we have not wasted re renderings
// use same session when reading store. Done
// this way avoid unnecessary  object creations.
const mapState = state => {
  let pilot, mechs;
  const session = getEntitiesSession(state);
  const { Mech } = session;

  const currentPilot = selectCurrentPilot(state);

  const pilotIsSelected = Boolean(currentPilot);
  const isEditingPilot = selectIsEditingPilot(state);
  if (pilotIsSelected) {
    const session = isEditingPilot
      ? getEditingEntitiesSession(state)
      : getEntitiesSession(state);

    const { Pilot } = session;

    if (Pilot.hasId(currentPilot)) {
      pilot = Pilot.withId(currentPilot).ref;
    }
  }
  //get mechs to display// USE SELECTOR TO MEMOIZE
  mechs = Mech.all()
    .toModelArray()
    .map(mechModel => mechModel.toJSON());
  return { pilot, pilotIsSelected, isEditingPilot, mechs };
};

export default connect(mapState, actions)(PilotDetails);
