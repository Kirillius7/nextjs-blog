import { asClass } from "awilix";
import { ArtistService } from "./ArtistService";
import { EventSeriesService } from "./EventSeriesService";
import { EventService } from "./EventService";
import { OrderService } from "./OrderService";
import { TicketService } from "./TicketService";
import { UserService } from "./UserService";
export interface IServiceContainer{
    ArtistService: ArtistService;
    EventService: EventService,
    EventSeriesService: EventSeriesService,
    OrderService: OrderService,
    TicketService: TicketService,
    UserService: UserService
}

export default {
    /*
    artistService: asClass(ArtistService).singleton(),
    eventService: asClass(EventService).singleton(),
    eventSeriesService: asClass(EventSeriesService).singleton(),
    orderService: asClass(OrderService).singleton(),
    ticketService: asClass(TicketService).singleton(),
    userService: asClass(UserService).singleton()
    */
    ArtistService: asClass(ArtistService).singleton(),
    EventService: asClass(EventService).singleton(),
    EventSeriesService: asClass(EventSeriesService).singleton(),
    OrderService: asClass(OrderService).singleton(),
    TicketService: asClass(TicketService).singleton(),
    UserService: asClass(UserService).singleton()
}