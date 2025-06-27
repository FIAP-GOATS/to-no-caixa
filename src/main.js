import App from "./modules/app/app.js";
import * as dotenv from "dotenv";


async function main() {
  dotenv.config();
  const app = new App();
  app.init();
}
main()