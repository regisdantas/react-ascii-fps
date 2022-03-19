export const defaultConsts = {
  defaultPlayerSpeed: 0.05,
  defaultPlayerSpin: 0.04,
  defaultFieldOfView: Math.PI / 4,
  defaultRayStepSize: 1,

  defaultRenderOptions: {
    // skyChar: ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    skyChar: ["-", "\\", "|", "/", "-"],
    wallChar: ["░", "▒", "▓", "█"],
    floorChar: ["@", ";", "."],
  },

  defaultMapOptions: {
    wallChar: "#",
    floorChar: " ",
  },
};
