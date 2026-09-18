import { GET } from "@/Server/decorators/decorator";
import { sessionUserMiddlewares } from "../Auth/middleware";
import { USE } from "../decorators/USE";
import type { ActionProps } from "./BaseController";
import BaseController from "./BaseController";

@USE(...sessionUserMiddlewares)
export class HomeController extends BaseController{
    constructor(opts){
      super(opts)
    }

    @GET("/")
    public async getHomePage(props: ActionProps){
        return {}
    }
}