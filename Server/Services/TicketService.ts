import { models } from "Server/Models";

export class TicketService{
    public getTicketList = async(filters) => {
        const { eventid, category } = filters;
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
        
        return data;
    }
}