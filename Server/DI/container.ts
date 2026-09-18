// container.ts
console.log("cont poch")
import * as awilix from "awilix";
import config from "config";
import { createDB } from "db";

import controllers from "Server/Controllers";
import services from "Server/Services";

import { modelRegistrations } from "Server/Models/IModelContainer";
import initAssociations from "Server/Models/associations";

import type IContextContainer from "Server/DI/Interfaces/IContextContainer";

import { roles, rules } from "../../config.acl";

console.log("CONTAINER POCHATOK");

const container = awilix.createContainer<IContextContainer>({
  injectionMode: awilix.InjectionMode.PROXY,
});

// реєстрація всіх залежностей програми, які проходять через один центр
// container.cradle - proxy object 
// (знаходить registration створює instance inject dependencies кешує singleton повертає object)
container.register({
  config: awilix.asValue(config),
  db: awilix.asFunction(createDB).singleton(),
  roles: awilix.asValue(roles),
  rules: awilix.asValue(rules),
  ...modelRegistrations,
  ...services,
  ...controllers,
});

const models = container.cradle;

initAssociations(models);

console.log("CONTAINER READY");

export default container;