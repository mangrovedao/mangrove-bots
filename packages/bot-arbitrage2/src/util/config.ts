import dotenvFlow from "dotenv-flow";
dotenvFlow.config();
import config from "config";
if (!process.env["NODE_CONFIG_DIR"]) {
  process.env["NODE_CONFIG_DIR"] = __dirname + "/../../config/";
}

export default config;
export { config };
