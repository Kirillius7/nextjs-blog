//import { Op } from "sequelize";
//import { models } from "../../Server/Models/index";
//import { GRANT } from "@/acl/types";
//import { UserRole as ROLE } from "@/constants";
import { GRANT } from "@/acl/types";
import "reflect-metadata";
import { USE } from "Server/decorators/USE";
import { authGuardMiddlewares, sessionUserMiddlewares } from "../Auth/middleware";
import { Query } from "../decorators/validateDecorator";
//import GET from "Server/decorators/GET";
//import { GET } from "../decorators/decorator";
import { GET } from "@/Server/decorators/decorator";
import { AccessDeniedError } from "../Exceptions";
import type { ActionProps } from "./BaseController";
import BaseController from "./BaseController";

@USE(...sessionUserMiddlewares)
export class ArtistController extends BaseController{
    /*private artistService;
    public constructor({artistService}){
        // extend BaseContext and remove constuctor
        this.artistService = artistService;
        this.getArtistList= this.getArtistList.bind(this)
    }
    */
   constructor(opts){ 
    // під час створення new ArtistController(opts) 
    // awilix на основі зареєстрованих даних контейнера створює dependency object
    // викликаючи обʼєкт контроллера з передачею параметрів opts (db, controllers, service, config)
    
    // express думає, що викликає метод getArtistList, але він вже замінений на wrapper function 
    // (що приймає req,res, викликає оригінальний метод контролера, робить response)
    super(opts);

    //this.getArtistList= this.getArtistList.bind(this) 
    // важливо для callback, адже у api передача просто function reference
    // bind(this) -> вказується як поточний instance класу 
    // (важливо для передачі методу як змінної або коли треба звернутись до змінних у методі, який не є =>)
    
   }

        /*
        return this.di.ArtistService.getArtistList(req.query)
            .then(events => {
                return this.ok(res, events);
            }).catch(er => {
                return this.fail(res, er.message)
            });
        */

    // контролер більше не знає про req,res, express (http-layer)
    // він відповідає тільки за координацію: взяв дані -> передав у сервіс -> повернув результат

    // запис метаданих Reflect.defineMetadata ({get: ["getArtistList"]}, ArtistController.prototype)
    // -> в памʼяті є ArtistController.prototype і метадані - це зроблено у якості побудови довідника
    @GET("/api/artists")
    @GET("/artists")
    /*
    @GET("/artists", {
            allow: {
                [ROLE.ADMIN]: [GRANT.READ],
            }
        }
    )*/
    @Query({ // незалежний окремий виклик для формування validate + closure
      type: "object",
      properties: {
        stageName:{
          type: "string"
        },
      },
      additionalProperties: false
    })
    @USE(...authGuardMiddlewares) 
    public async getArtistList(reqData: ActionProps){
        //const test: ActionProps = reqData;

        //const testQuery = reqData.query;

        console.log("artistcontroller.ts");
        console.log("artistcontroller.ts")
        const {query, guard} = reqData;

        console.log("ROLE:", guard.role);
        console.log("RESOURCE:", guard.resource);

        console.log(
            "READ ALLOWED:",
            guard.allow(GRANT.READ)
        );

        if(!guard.allow(GRANT.READ)){
            throw new AccessDeniedError();
        }
        //return this.di.ArtistService.getArtistList(query)
        const artists = await this.di.ArtistService.getArtistList(query)
        return{
            artists
        }
    }
        
}