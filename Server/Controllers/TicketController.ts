//import { models } from "../../Server/Models/index";
export class TicketController{
    private ticketService;
    public constructor({ticketService}){
      this.ticketService = ticketService;
    }
    public getTicketList = async(req, res) => {
        /*
        const { eventid, category } = req.query;
          //const { Ticket } = req.models;
          const {Ticket} = models;
        
          const whereClause = {
            statusticket: "available",
            ...(eventid != null && { eventid: Number(eventid) }), // якщо є id події - асигнування до змінної, інакше - не визначена
            ...(category && { category }), // визначення категорії типу квитка (vip, ordinary, special)
          };
        
          const data = await Ticket.findAll({
            where: whereClause,
            order: [["eventid", "ASC"]],
            raw: true,
          });
        */
          const tickets = await this.ticketService.getTicketList(req.query);
          //return res.status(200).json(data);
          return res.status(200).json({
            success: true,
            data: tickets
          });
    }
}

/*
const ticketController = new TicketController();
export default ticketController;*/