//import { Op } from "sequelize";
//import { models } from "../../Server/Models/index";

export class ArtistController{
    private artistService;
    public constructor({artistService}){
        this.artistService = artistService;
    }
    public getArtistList = async(req, res) =>{
        //const {Event, Artist} = req.models; // початок роботи з моделями use для дій з таблицями БД
        /*
            const { stageName } = req.query; // зчитування параметрів із запиту URL 
            const {Event, Artist} = models;
            let eventIdsWithFilteredArtist: number[] | null  = null;
        
            // 1. Пошук ID подій, де бере участь виконавець, на основі якого відбувається фільтрація
            if (stageName) {
                const eventsWithArtist = await Event.findAll({ // запит від sequelize до таблиці 
                    attributes: ['id'], // робота лише з полем id
                    include: [{ // join таблиці М:М (Event + Artist)
                        model: Artist,
                        as: "Performers", // alias (назва звʼязку)
                        where: {
                            stage_name: { [Op.like]: `%${stageName}%` } // пошук виконавців на основі певних даних 
                            // до пошуку залучений оператор like -> який буде фільтрувати дані, на основі слова "всередині"
                        },
                        attributes: [], // ID подій, без додаткових даних 
                        through: { attributes: [] } // приховування проміжної таблиці М:М 
                    }],
                    raw: true // повернення простого json-обʼєкта
                });
                
                // Створення масиву ID: [1, 5, 12...]
                eventIdsWithFilteredArtist = eventsWithArtist.map(e => e.id);
            }
        
            // 2. Основний запит
            const whereClause:any = { status_event: "active" }; // фільтр для пошуку лише активних подій
        
            // Пустий масив у разі відсутніх даних 
            if (stageName && eventIdsWithFilteredArtist?.length === 0) {
                //return res.status(200).json([]);
                return res.status(200).json({
                    success: true,
                    data: []
                })
            }
        
            // Фільтр по знайдених ID
            if (eventIdsWithFilteredArtist) {
                whereClause.id = { [Op.in]: eventIdsWithFilteredArtist }; // додавання фільтру для подій з певним id (список in)
            }
        
            const events = await Event.findAll({ // запит до таблиці 
                where: whereClause, // фільтри (номера id + активний статус)
                order: [["id", "ASC"]],
                include: [ // підключення таблиці Artist через alias 
                    {
                        model: Artist,
                        as: "Performers",
                        attributes: ["id", "stage_name"], // вибірка полів
                        through: { attributes: [] }, // приховування проміжної таблиці М:М 
                        required: false // Параметр false, щоб завантажити всіх інших артистів, з якими бере участь "відфільтрований"
                    },
                ],
            });
        
            //return res.status(200).json(events);
            return res.status(200).json({
                success: true,
                data: events
            })
        */

        const events = await this.artistService.getArtistList(req.query);
        return res.status(200).json({
                success: true,
                data: events
        })

    }
}


//const artistController = new ArtistController()

// export default artistController;