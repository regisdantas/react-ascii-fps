import PropTypes from "prop-types";
import React, { Component } from "react";
import ASCIIGameEngine from "../react-ascii-game-engine";

const lines = 80;
const cols = 134;
const fps = 60;

export default class Game extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {
      engine: new ASCIIGameEngine(lines, cols, fps),
    };
  }

  render() {
    return this.state.engine.render();
  }
}
