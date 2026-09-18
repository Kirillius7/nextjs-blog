/*import container from "../DI/container";
import initAssociations from "./associations";
import type { IModelContainer } from "./index";
const cradle = container.cradle;
const sequelizeModels: IModelContainer = {
   
    User: container.resolve("User"),
    Event: container.resolve("Event"),
    Order: container.resolve("Order"),
    Artist: container.resolve("Artist"),
    EventArtist: container.resolve("EventArtist"),
    EventSeries: container.resolve("EventSeries"),
    Ticket: container.resolve("Ticket")
    
}
console.log("CREATE MODELS IMPORTED");
console.log("AVAILABLE KEYS:", Object.keys(container.registrations || {}));
console.log("CRADLE:", Object.keys(container.cradle || {}));
console.log("ASSOCIATIONS INIT START");
initAssociations(sequelizeModels);
console.log("ASSOCIATIONS INIT END");

export { sequelizeModels };
*/

import container from "../DI/container";
import initAssociations from "./associations";

export function initModels() {
  console.log("INIT MODELS START");

  const models = container.cradle;

  console.log("CRADLE KEYS:", Object.keys(models));

  initAssociations(models);

  console.log("INIT MODELS END");
}