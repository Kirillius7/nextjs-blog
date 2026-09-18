//import { models } from "../../Server/Models/index";
import "reflect-metadata";
//import GET from "Server/decorators/GET";
import { GET } from "@/Server/decorators/decorator";
import { USE } from "Server/decorators/USE";
import { authGuardMiddlewares, sessionUserMiddlewares } from "../Auth/middleware";

import { Params, Query } from "../decorators/validateDecorator";
//import { Query } from "../decorators/validateDecorator";
import { GRANT } from "@/acl/types";
import { AccessDeniedError } from "../Exceptions";
import type { ActionProps } from "./BaseController";
import BaseController from "./BaseController";

@USE(...sessionUserMiddlewares)
export class UserController extends BaseController{
    /*private userService;
    public constructor({userService}){
      this.userService = userService;
    }*/

    constructor(opts){
      super(opts);

      //this.getUserList = this.getUserList.bind(this);
    }
    @GET("/api/users")
    @GET("/api/users/:userid")
    @GET("/users/:userid")
    @GET("/users")
    
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

    public async getUserList(reqData: ActionProps) {
      const {query, params, guard} = reqData;
      console.log("query: ", query);
      console.log("params: ", params);
              console.log("ROLE:", guard.role);
              console.log("RESOURCE:", guard.resource);
      
              console.log(
                  "READ ALLOWED:",
                  guard.allow(GRANT.READ)
              );
      
              if(!guard.allow(GRANT.READ)){ //  actualReq.guard.resource = route, рядок, що визначає доступ до ресурсу (можна тут пропустити шлях)
                  throw new AccessDeniedError();
              }
      const users = await this.di.UserService.getUserList(query);
      //const userid = reqData.query.orderid ? Number(reqData.query.orderid) : null;
      const userid = reqData.query.userid ? Number(reqData.query.userid) : null;
      return{
        users,
        userid
      }
      //return this.di.UserService.getUserList(query);
    }
      /*return this.di.UserService.getUserList(req.query).then(users => {
        return this.ok(res, users);
      }).catch(er => {
        return this.fail(res, er.message)
      })
    }*/
}