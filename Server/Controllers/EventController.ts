//import { models } from "../../Server/Models/index";
import { GET } from "@/Server/decorators/decorator";
import "reflect-metadata";
import { USE } from "Server/decorators/USE";
import { sessionUserMiddlewares } from "../Auth/middleware";
import { Query } from "../decorators/validateDecorator";
import type { ActionProps } from "./BaseController";
import BaseController from "./BaseController";

@USE(...sessionUserMiddlewares)
export class EventController extends BaseController{
    /*private eventService;
    public constructor({eventService}){
      this.eventService = eventService;
    }
    */
    constructor(opts){
      super(opts);
      //this.getEventList = this.getEventList.bind(this);
      console.log("asd");
      //this.autoWrapExpressMethods();
    }

    @GET("/api/events")
    @GET("/events")
    @GET("/series")
    @Query({ // незалежний окремий виклик для формування validate + closure
      type: "object",
      properties: {
        seriesId: {
          type: "string",
          pattern: "^[1-9]\\d*$"
        },
        audienceType:{
          type: "string",
          enum: ["professional", "niche", "general", "youth", "adult"]
        },
        venueType: {
          type: "string",
          enum: ["indoor", "outdoor", "mixed"]
        },
        scale:{
          type: "string",
          enum: ["local", "regional", "international", "global"]
        }
      },
      additionalProperties: false
    })
    public async getEventList(reqData: ActionProps) {
    //public getEventSeriesList(reqData){ -> test
      const {query} = reqData;
      const seriesid = reqData.query.seriesId ? Number(reqData.query.seriesId) : null
      const events = await this.di.EventService.getEventList(query);
      return {
        events,
        seriesid
      }
       //return this.di.EventService.getEventList(query);
       //return this.di.EventService.getEventSeriesList(query); -> test
    }
    /*
    public getEventList(req, res){
         return this.di.EventService.getEventList(req.query).then(data => {
            return this.ok(res, data);
         }).catch(er => {
            return this.fail(res, er.message)
         })
    }
    */
    

}