//import { models } from "../../Server/Models/index";

export class UserController{
    private userService;
    public constructor({userService}){
      this.userService = userService;
    }
    public getUserList = async(req, res) => {
      /*
        const { eventName, categoryTicket,userid } = req.query;
    const {User, Order, Ticket, Event} = models;

    const eventsWhere: any = {};
    const ticketsWhere: any = {};
    //const useridWhere: any = {};
    if(eventName) eventsWhere.eventName = eventName;
    if(categoryTicket) ticketsWhere.category = categoryTicket;
    //if(userid) useridWhere.userid = userid;
    const users = await User.findAll({
    where: {role: "client", ...(userid && {id: userid})},
    include:[{
      model: Order,
      as: "orders",
      required: true,
      include:[{
        model: Ticket,
        as: "tickets",
        required: true,
        where: Object.keys(ticketsWhere).length ? ticketsWhere : undefined,
        include:[{
          model: Event,
          as: "eventTicket",
          attributes: ["eventName"],
          where: Object.keys(eventsWhere).length ? eventsWhere : undefined,
          required: true
        }]
      }],
      attributes: ["id", "userid"],
      //through: { attributes: [] },
      //required: false, // виведення всіх подій, навіть якщо деякі з них не мають серій
    }],
  });
  */
  
  const users = await this.userService.getUserList(req.query);
  return res.status(200).json({
            success: true,
            data: users
          });
    }
}

/*
const userController = new UserController();
export default userController;
*/