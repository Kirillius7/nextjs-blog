//import { models } from "../../Server/Models/index";

import { GET } from "@/Server/decorators/decorator";
import "reflect-metadata";
import { USE } from "Server/decorators/USE";
import { sessionUserMiddlewares } from "../Auth/middleware";
import { Query } from "../decorators/validateDecorator";
import type { ActionProps } from "./BaseController";
import BaseController from "./BaseController";

@USE(...sessionUserMiddlewares)
export class TicketController extends BaseController{
    /*private ticketService;
    public constructor({ticketService}){
      this.ticketService = ticketService;
    }*/
    constructor(opts){
      super(opts);

      //this.getTicketList = this.getTicketList.bind(this);
    }
        /*
          return this.di.TicketService.getTicketList(req.query).catch(tickets => {
            return this.ok(res, tickets);
          }).catch(er => {
            return this.fail(res, er.message);
          })
    }*/


    /*
      @GET("/api/tickets")
      public getTicketList(reqData){
        console.log("controller data:", reqData);
        const {query} = reqData;
        return this.di.TicketService.getTicketList(query);
      }

      @GET("/tickets")
      public getGroupedTicketList(reqData){
        const {query} = reqData;
        return this.di.TicketService.getGroupedTicketList(query);
      }
    */

    /*
    @GET("/tickets")
    public async getGroupedTicketList(reqData) {
      //console.log("reqData", reqData)
      const eventId = reqData.query.eventid ? Number(reqData.query.eventid) : null;
      const tickets = await this.di.TicketService.getGroupedTicketList(reqData.query);
           console.log("CONTROLLER RETURN:", {
          //getGroupedTicketList: tickets,
          tickets,
          eventId: eventId
      });
     return{
        tickets,
        eventid: eventId
     }
    }

    @GET("/api/tickets")
    public async getTicketList(reqData) {
      const eventId = reqData.query.eventid ? Number(reqData.query.eventid) : null;
      const tickets = await this.di.TicketService.getGroupedTicketList(reqData.query);
      console.log(reqData)
    //return this.di.TicketService.getGroupedTicketList(reqData.query);
      console.log("CONTROLLER RETURN:", {
          //getTicketList: tickets,
          tickets,
          eventId: eventId
      });
      return{
        tickets,
        eventid: eventId
     }

    }
    */
    /*
    // Для клієнтських API запитів
    @GET("/api/tickets")
    public async getApiGroupedTicketList(reqData: any) {
      const { query } = reqData;
      return await this.di.TicketService.getGroupedTicketList(query);
    }*/

  
    @GET("/api/tickets")
    @GET("/tickets")
    @Query({
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["vip", "special", "ordinary"]
        },
        eventid: {
          type: "string",
          pattern: "^[1-9]\\d*$"
        }
      },
      additionalProperties: false
    })

    public async getTicketsList(reqData: ActionProps) {
        const eventId = reqData.query.eventid ? Number(reqData.query.eventid) : null;
        const tickets = await this.di.TicketService.getGroupedTicketList(reqData.query);

        return{
          tickets,
          eventId
        }
    }
    


    
}