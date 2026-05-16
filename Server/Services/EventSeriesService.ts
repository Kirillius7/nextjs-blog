import { models } from "../../Server/Models/index";

export class EventSeriesService{

    public getEventSeriesList = async(filters) =>{
         const{EventSeries} = models;
          // Створюємо об'єкт фільтрації
          const whereClause: any = {};
          const {audienceType, venueType, scale} = filters;
          // Асигнування умови лише якщо вони передані в запиті
          if (audienceType) whereClause.audienceType = audienceType;
          if (venueType) whereClause.venueType = venueType;
          if (scale) whereClause.scale = scale;
        
          const data = await EventSeries.findAll({
            where: whereClause,
            raw: true // повернення простого json-обʼєкта (без методів, без стану та можливості взаємодіяти з БД)
          });
        
        return data;
    }
}