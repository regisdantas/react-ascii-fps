import PropTypes from "prop-types";
import React, { Component } from "react";
import ASCIIGameEngine from "../react-ascii-game-engine";

const lines = 80;
const cols = 134;
const fps = 60;

const mapLines = 20;
const mapCols = 20;

export default class Game extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.engine = new ASCIIGameEngine(cols, lines, fps);
    this.map = ASCIIGameEngine.CreateGameMap(mapCols, mapLines, {
      wallChar: "#",
      floorChar: ".",
    });
    this.state = {};
    console.log(this.state.map);
  }

  render() {
    this.engine.DrawMap(this.map, 2, 2);
    return this.engine.render();
  }
}
