import { asClass } from "awilix";
import { AuthController } from "../Auth/AuthController";
import { ArtistController } from "./ArtistController";
import { EventController } from "./EventController";
import { EventSeriesController } from "./EventSeriesController";
import { HomeController } from "./HomeController";
import { OrderController } from "./OrderController";
import { TicketController } from "./TicketController";
import { UserController } from "./UserController";


// реєстр контроллерів, які awilix повинен вміти створити, коли програма звертається до нього під час оголошення певного запиту
export interface IControllerContainer{
    AuthController: AuthController,
    ArtistController: ArtistController,
    EventController: EventController,
    EventSeriesController:EventSeriesController,
    OrderController: OrderController,
    TicketController: TicketController,
    UserController: UserController,
    HomeController: HomeController
}
    console.log("index controller pochatok?");
export default {
    authController: asClass(AuthController).singleton(),
    artistController: asClass(ArtistController).singleton(),
    eventController: asClass(EventController).singleton(),
    eventSeriesController: asClass(EventSeriesController).singleton(),
    orderController: asClass(OrderController).singleton(),
    ticketController: asClass(TicketController).singleton(),
    homeController: asClass(HomeController).singleton(),
    userController: asClass(UserController).singleton()
}