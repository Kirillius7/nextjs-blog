//import { models } from "../../Server/Models/index";
import "reflect-metadata";
//import GET from "Server/decorators/GET";
import { GET } from "@/Server/decorators/decorator";
import { authGuardMiddlewares, sessionUserMiddlewares } from "../Auth/middleware";

import { USE } from "../decorators/USE";
import { Params, Query } from "../decorators/validateDecorator";
import type { ActionProps } from "./BaseController";
import BaseController from "./BaseController";

@USE(...sessionUserMiddlewares)
export class OrderController extends BaseController{
    /*private orderService;
    public constructor({orderService}){
      this.orderService = orderService;
    }*/
    constructor(opts){
      super(opts);

      //this.getOrdersList = this.getOrdersList.bind(this)
    }

        /*
          return this.di.OrderService.getOrdersList(req.query).catch(orders => {
            return this.ok(res, orders)
          }).catch(er => {
            return this.fail(res, er.message);
          })
    }*/
    @GET("/api/orders")
    @GET("/orders/:orderid") 
    @GET("/orders")
    @Query({ // незалежний окремий виклик для формування validate + closure
      type: "object",
      properties: {
        categoryTicket: {
          type: "string",
          enum: ["vip", "special", "ordinary"]
        },
        eventName:{
          type: "string"
        },
      },
      additionalProperties: false
    }) 
    @Params({ // незалежний окремий виклик для формування validate + closure
      type: "object",
      properties: {
        userid: {
          type: "string",
          pattern: "^[1-9]\\d*$"
        }
      },
      //required: ["userid"],
      additionalProperties: false
    })
    @USE(...authGuardMiddlewares)
    public async getOrdersList(reqData: ActionProps){
      const {query} = reqData;
      //return this.di.OrderService.getOrdersList(query)
      const orders = await this.di.OrderService.getOrdersList(query);
      const orderid = reqData.query.orderid ? Number(reqData.query.orderid) : null;
      return {
        orders,
        orderid
      }
    }
}