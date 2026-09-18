//import { models } from "Server/Models";
//import IContextContainer from "Server/DI/Interfaces/IContextContainer";
import { EventType } from "Server/Models/Event";
import { OrderType } from "Server/Models/Order";
import { TicketType } from "Server/Models/Ticket";
import { UserType } from "Server/Models/User";
import bcrypt from "bcrypt";
import { AnswerType, ConflictError } from "../Exceptions";
export class UserService{
    private Order: any;
    private Event: any;
    private Ticket: any;
    private User: any;
    constructor({Order, Event, Ticket, User} : {Order: OrderType, Event: EventType, Ticket: TicketType, User: UserType}) {
        this.Order = Order,
        this.Event = Event,
        this.Ticket = Ticket,
        this.User = User
    }
    public getUserList = async(filters: any = {}) =>{
        const { eventName, categoryTicket,userid } = filters || {};
        //const {User, Order, Ticket, Event} = models;
        //const {User, Order, Ticket, Event} = this.ctx;

        const eventsWhere: any = {};
        const ticketsWhere: any = {};
        //const useridWhere: any = {};
        /*
        const allowedQueryParams = ["categoryTicket", "eventName", "userid"];
        const categoryTicketList = ["vip", "special", "ordinary"];

        for (const key of Object.keys(filters)) {
          if (!allowedQueryParams.includes(key)) {
              throw new ValidateError();
          }
        }

        if(categoryTicket && !categoryTicketList.includes(categoryTicket))
            throw new ValidateError();
        */
       
        if(eventName) eventsWhere.eventName = eventName;
        if(categoryTicket) ticketsWhere.category = categoryTicket;
        //if(userid) useridWhere.userid = userid;

        /*
        if(userid !== null && userid !== "" && userid !== undefined){
            if(!/^\d+$/.test(String(userid)))
                throw new ValidateError();
        }
        */
        const users = await this.User.findAll({
            where: {role: "client", ...(userid && {id: userid})},
            include:[{
            model: this.Order,
            as: "orders",
            required: true,
            include:[{
                model: this.Ticket,
                as: "tickets",
                required: true,
                where: Object.keys(ticketsWhere).length ? ticketsWhere : undefined,
                include:[{
                model: this.Event,
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

        return users.map(user => user.toJSON());
    }

    // пошук користувача в БД за даними пошти
    public async getUserByEmail(email: string) {
        const user = await this.User.findOne({
        where: { email: email.toLowerCase().trim() }
        });
        return user; // повернення об'єкта користувача або null
    }

    public async findUserWithEmailAndPassword(email: string, password: string) {
        // пошук користувача за поштою
        const user = await this.getUserByEmail(email);
        
        // у разі відсутності користувача з таким email в базі
        if (!user) {
            return null;
        }

        // перевірка паролю через bcrypt
        // password — сирий текст від користувача з форми логіну
        // user.password — захешований пароль, який зберігається в базі даних
        // оскільки bcrypt записує в БД хеш, який містить алгоритм, кількість раундів хешування + сіль 
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // якщо паролі не збігаються
        if (!isPasswordValid) {
            return null;
        }

        // якщо користувач є і пароль правильний — об'єкт користувача повертається в паспорт
        return user;
    }

    public async createUser(userData: any) {
        // Хешування сирого паролю, використовуючи 10 раундів генерації солі (salt rounds), що є золотим стандартом безпеки

        const existingUser = await this.getUserByEmail(userData.email);
        if (existingUser) {
            throw new ConflictError("User with this email already exists", { answer: AnswerType.Toast });
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // запис в базу вже захешованого паролю
        const newUser = await this.User.create({
            ...userData,
            username: userData.username,
            email: userData.email.toLowerCase().trim(),
            password: hashedPassword,
            createdAt: Math.floor(Date.now() / 1000),
        });

        return newUser;
    }
}