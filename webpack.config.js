const path = require("path");

module.exports = {
  mode: "production",
  context: path.resolve(__dirname, "scripts"),
  entry: {
    script: "./script.js",
  },
  output: {
    path: path.resolve(__dirname, "scripts"),
    filename: "[name].bundle.js",
  },
};
