//import { models } from "../../Server/Models/index";
//import GET from "Server/decorators/GET";
//import POST from "Server/decorators/POST";
import { GET, POST } from "@/Server/decorators/decorator";
import { USE } from "Server/decorators/USE";
//import { GRANT } from '../../acl/types';
//import { UserRole as ROLE } from "../../constants";
import { GRANT } from "@/acl/types";
import { sessionUserMiddlewares } from "../Auth/middleware";
import { Body, Query } from "../decorators/validateDecorator";
import { AccessDeniedError, AnswerType } from "../Exceptions";
import type { ActionProps } from "./BaseController";
import BaseController from "./BaseController";


// (параметри для внутрішнього методу декоратора) target - функція-конструктор класу (оскільки клас - це просто функція-конструктор)
// саме через конструктор реєструються нові обʼєкти класу (new()), для класового декоратора target-конструктор треба конвертувати насильно в target.prototype
/*@USE((req, res, next) => { 
  console.log("--Global middleware class--");
  next()
})*/

@USE(...sessionUserMiddlewares)
export class EventSeriesController extends BaseController{

    constructor(opts){
      super(opts)
    }

    //@GET("/api/event_series", {allow: {[ROLE.GUEST]: [GRANT.READ]}})
    @GET("/api/event_series")
    @GET("/series")
    /*
    @USE((req, res, next) => {
      console.log("--Local middleware function GET--");
      //throw new Error("Error from USE middelware !!");
      next()
    })
    */
    @Query({
      type: "object",
      properties: {
        audienceType: {
          type: "string",
          enum: [
            "adult",
            "youth",
            "professional",
            "niche",
            "general"
          ]
        },
        venueType: {
          type: "string",
          enum: [
            "outdoor",
            "indoor",
            "mixed"
          ]
        },
        scale: {
          type: "string",
          enum: [
            "local",
            "international",
            "regional",
            "global"
          ]
        },
      },
      additionalProperties: false
    })
    public async getEventSeriesList(reqData: ActionProps){
      const {query} = reqData;
      //throw new Error("No controller output here!");
      //return this.di.EventSeriesService.getEventSeriesList(query);
      const eventseries = await this.di.EventSeriesService.getEventSeriesList(query);
      return {
        eventseries
      }
    }

    /*
    @GET("/api/event_series")
    @USE((req, res, next) => {
      console.log("--Local middleware function getActiveEventSeriesList--");
      next()
    })
    public getActiveEventSeriesList(reqData){
      const {query} = reqData;
      return this.di.EventSeriesService.getEventSeriesList(query)
      //console.log("getActiveEventSeriesList")
    }
    */
   
    @POST("/api/event_series")
    /*
    @POST("/series", {
      allow: {
        [ROLE.ADMIN]: [GRANT.WRITE, GRANT.EXECUTE]
    }})*/
    @POST("/series")
    // (параметри для внутрішнього методу декоратора) target - прототип класу, propertyKey - назва методу
    // target (декоратор методу) - є прототипом класу, тому передається саме target, і не треба явно брати target.prototype для класу 
    
    /*@USE((req, res, next) => { 
      console.log("--Local middleware function POST--");
      next()
    })*/

    @Body({
      type: "object",
      properties: {
        name: {
          type: "string",
          minLength: 3,
          maxLength: 255
        },
        description: {
          type: "string",
          minLength: 10,
          maxLength: 255
        },
        audienceType: {
          type: "string",
          enum: [
            "adult",
            "youth",
            "professional",
            "niche",
            "general"
          ]
        },
        venueType: {
          type: "string",
          enum: [
            "outdoor",
            "indoor",
            "mixed"
          ]
        },
        scale: {
          type: "string",
          enum: [
            "local",
            "international",
            "regional",
            "global"
          ]
        },
      },
      required: [
          "name", "description", "audienceType", "venueType", "scale"
      ],
      additionalProperties: false
    })
    //@USE(...authGuardMiddlewares)
    public createEventSeries(reqData: ActionProps){
      const {body, guard} = reqData;
      if(!guard.allow(GRANT.WRITE)){
        throw new AccessDeniedError("You are not permitted to add info",{answer: AnswerType.Toast});
      }
      return this.di.EventSeriesService.createEventSeries(body);
    }
}
