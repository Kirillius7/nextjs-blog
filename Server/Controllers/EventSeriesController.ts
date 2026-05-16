//import { models } from "../../Server/Models/index";

export class EventSeriesController{
    private eventSeriesService;
    public constructor({eventSeriesService}){
      this.eventSeriesService = eventSeriesService;
    }
    /*
    public async getEventSeriesList(req, res){
        const { audienceType, venueType, scale } = req.query;
          //const {Event_Serie} = req.models;
          const{EventSeries} = models;
          // Створюємо об'єкт фільтрації
          const whereClause: any = {};
          
          // Асигнування умови лише якщо вони передані в запиті
          if (audienceType) whereClause.audienceType = audienceType;
          if (venueType) whereClause.venueType = venueType;
          if (scale) whereClause.scale = scale;
        
          const data = await EventSeries.findAll({
            where: whereClause,
            raw: true // повернення простого json-обʼєкта (без методів, без стану та можливості взаємодіяти з БД)
          });
        
          //return res.status(200).json(data);
          return res.status(200).json({
            success: true,
            data
          })
    }*/
    public getEventSeriesList = async(req, res) => {
      const data = await this.eventSeriesService.getEventSeriesList(req.query);

      return res.status(200).json({
            success: true,
            data
      })
    }
}

//const eventSeriesController = new EventSeriesController();
//export default eventSeriesController;