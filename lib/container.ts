import { asClass, createContainer, InjectionMode } from "awilix";

import { EventSeriesService } from "Server/Services/EventSeriesService";
import { EventSeriesController } from "../Server/Controllers/EventSeriesController";

import { ArtistController } from "Server/Controllers/ArtistController";
import { ArtistService } from "Server/Services/ArtistService";

import { EventController } from "Server/Controllers/EventController";
import { EventService } from "Server/Services/EventService";

import { OrderController } from "Server/Controllers/OrderController";
import { OrderService } from "Server/Services/OrderService";

import { TicketController } from "Server/Controllers/TicketController";
import { TicketService } from "Server/Services/TicketService";

import { UserController } from "Server/Controllers/UserController";
import { UserService } from "Server/Services/UserService";


const container = createContainer({
    injectionMode: InjectionMode.PROXY,
    strict: true
});

container.register({
    eventSeriesController: asClass(EventSeriesController).singleton(),
    eventSeriesService: asClass(EventSeriesService).singleton(),

    artistService: asClass(ArtistService).singleton(),
    artistController: asClass(ArtistController).singleton(),

    eventService: asClass(EventService).singleton(),
    eventController: asClass(EventController).singleton(),

    orderService: asClass(OrderService).singleton(),
    orderController: asClass(OrderController).singleton(),

    ticketService: asClass(TicketService).singleton(),
    ticketController: asClass(TicketController).singleton(),

    userService: asClass(UserService).singleton(),
    userController: asClass(UserController).singleton(),
})

export default container;