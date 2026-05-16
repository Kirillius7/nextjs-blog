//import { models } from "../../Server/Models/index";

export class OrderController{
    private orderService;
    public constructor({orderService}){
      this.orderService = orderService;
    }
    public getOrdersList = async(req, res) => {
          /*
          const { eventName, categoryTicket,orderid } = req.query;
        
          const {Order, User, Event, Ticket} = models;
          
          const eventsWhere: any = {};
          const ticketWhere: any = {};
        
          if(eventName) eventsWhere.eventName = eventName;
          if(categoryTicket) ticketWhere.category = categoryTicket;
        
          console.log("Object.keys(eventsWhere).length", Object.keys(eventsWhere).length)
          console.log("Object.keys(ticketWhere).length", Object.keys(ticketWhere).length)
        
          const orders = await Order.findAll({
            where: {statusorder: "paid", ...(orderid && {id: orderid})},
            include: [{
              model: Ticket,
              as: "tickets",
              required: true,
              where: Object.keys(ticketWhere).length ? ticketWhere : undefined,
              
        
              include: [{
                model: Event,
                as: "eventTicket",
                attributes: ["eventName"],
                required: true,
                where: Object.keys(eventsWhere).length ? eventsWhere : undefined,
                
              }]
            }]
          })
          */
          
          const orders = await this.orderService.getOrdersList(req.query);
          return res.status(200).json({
            success: true,
            data: orders
          });
    }
}

//const orderController = new OrderController();

//export default orderController;