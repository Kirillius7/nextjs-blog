//import { models } from "Server/Models";
//import IContextContainer from "Server/DI/Interfaces/IContextContainer";
import { TicketType } from "Server/Models/Ticket";
//import { ValidateError } from "../Exceptions";
export interface ITicket {
  id: number;
  eventid: number;
  priceperticket: number;
  statusticket: string;
  category: string;
}
export type GroupedTickets = Record<number, ITicket[]>;
export class TicketService{
    private Ticket : any;
    constructor({Ticket} : {Ticket:TicketType}) {
      this.Ticket = Ticket;
    }

    /*
    public getTicketList = async(filters: any = {}) => {
      console.log("service filters:", filters);
        const { eventid, category } = filters;
          //const { Ticket } = req.models;
          //const {Ticket} = this.ctx;
        
          const whereClause = {
            statusticket: "available",
            ...(eventid != null && { eventid: Number(eventid) }), // якщо є id події - асигнування до змінної, інакше - не визначена
            ...(category && { category }), // визначення категорії типу квитка (vip, ordinary, special)
          };
        
          const data = await this.Ticket.findAll({
            where: whereClause,
            order: [["eventid", "ASC"]],
            raw: true,
          });
        //console.log("data:", data);
        return data;
    }

    public groupTickets(tickets: any[]){
      return tickets.reduce((acc: any, ticket: any) => { // перетворення масиву в обʼєкт
        // acc - об’єкт (результат), який містить ключі та значення, ticket - кожен елемент масиву {} - початкове значення
        const key = ticket.eventid; // угрупування на основі ключа події

        if (!acc[key]) 
          acc[key] = []; // якщо під певним key не існує масиву обʼєктів - треба створити пустий масив для додавання даних

        acc[key].push(ticket); // додавання обʼєкту ticket під певний key

        return acc; // передача обʼєкта на наступному кроці ітерації
      }, {});
    }

    public getGroupedTicketList = async (filters: any = {}) => {
      const tickets = await this.getTicketList(filters);
      return this.groupTickets(tickets)
    }
  */
    public getGroupedTicketList = async(filters: any = {}) => {

        const whereClause: any = {
            statusticket: "available"
        };
        console.log("filters.eventid",filters.eventid)
        const { eventid, category } = filters || {};
        /*
        const allowedQueryParams = ["eventid", "category"];
        const categoryTicketList = ["vip", "special", "ordinary"];

        for (const key of Object.keys(filters)) {
          if (!allowedQueryParams.includes(key)) {
              throw new ValidateError();
          }
        }

        if(category && !categoryTicketList.includes(category))
          throw new ValidateError();

        console.log("eventid:", eventid)

        if(eventid !== null && eventid !== "" && eventid !== undefined){
            if(!/^\d+$/.test(String(eventid)))
                throw new ValidateError();
        }
        */
        if (eventid) {
            whereClause.eventid = Number(eventid);
        }


        if (category) {
            whereClause.category = category;
        }


        const tickets = await this.Ticket.findAll({
            where: whereClause,

            order: [
                ["eventid", "ASC"],
                ["id", "ASC"]
            ],

            raw: true
        });


        return this.groupTicketsByEvent(tickets);
    };

    private groupTicketsByEvent(tickets: ITicket[]) {
    return tickets.reduce((acc: any, ticket) => {

        if (!acc[ticket.eventid]) {
            acc[ticket.eventid] = [];
        }

        acc[ticket.eventid].push(ticket);

        return acc;

      }, {});
    }

}