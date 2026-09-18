//import { models } from "Server/Models";
//import IContextContainer from "Server/DI/Interfaces/IContextContainer";
import { EventType } from "Server/Models/Event";
import { OrderType } from "Server/Models/Order";
import { TicketType } from "Server/Models/Ticket";
//import { ValidateError } from "../Exceptions";
export class OrderService{
    private Order: any;
    private Event: any;
    private Ticket: any;

    constructor({Order, Event, Ticket} : {Order: OrderType, Event: EventType, Ticket: TicketType}) {
      this.Event = Event;
      this.Order = Order;
      this.Ticket = Ticket;
    }
  
    public getOrdersList = async(filters: any = {}) =>{
          const { eventName, categoryTicket,orderid } = filters || {};

          //const {Order, User, Event, Ticket} = this.ctx;
          
          const eventsWhere: any = {};
          const ticketWhere: any = {};
          /*
          const allowedQueryParams = ["orderid", "categoryTicket", "eventName"];
          const categoryTicketList = ["vip", "special", "ordinary"];

          for (const key of Object.keys(filters)) {
            if (!allowedQueryParams.includes(key)) {
                throw new ValidateError();
            }
          }

          if(categoryTicket && !categoryTicketList.includes(categoryTicket))
            throw new ValidateError();
          */
          if(eventName) eventsWhere.eventName = eventName;
          if(categoryTicket) ticketWhere.category = categoryTicket;
          /*
          if(orderid !== null && orderid !== "" && orderid !== undefined){
              if(!/^\d+$/.test(String(orderid)))
                  throw new ValidateError();
          }*/

          console.log("Object.keys(eventsWhere).length", Object.keys(eventsWhere).length)
          console.log("Object.keys(ticketWhere).length", Object.keys(ticketWhere).length)
        
          const orders = await this.Order.findAll({
            where: {statusorder: "paid", ...(orderid && {id: orderid})},
            include: [{
              model: this.Ticket,
              as: "tickets",
              required: true,
              where: Object.keys(ticketWhere).length ? ticketWhere : undefined,
              
        
              include: [{
                model: this.Event,
                as: "eventTicket",
                attributes: ["eventName"],
                required: true,
                where: Object.keys(eventsWhere).length ? eventsWhere : undefined,
                
              }]
            }]
          })
          return orders.map(order => order.toJSON());
    }
}