//import { models } from "../../Server/Models/index";
//import IContextContainer from "Server/DI/Interfaces/IContextContainer";
import { Event_SerieType } from "Server/Models/Event_Series";
//import { ValidateError } from "../Exceptions";
export class EventSeriesService{
    private EventSeries: any;

    constructor({EventSeries} : {EventSeries : Event_SerieType}) {
      this.EventSeries = EventSeries;
    }

    
    public getEventSeriesList = async(filters: any = {}) =>{
         //const{EventSeries} = this.ctx;
          // Створюємо об'єкт фільтрації

          /*
          const audienceTypeList = ["professional", "niche", "general", "youth", "adult"];
          const venueTypeList = ["indoor", "outdoor", "mixed"];
          const scaleList = ["local", "regional", "international", "global"];
          const allowedQueryParams = ["audienceType", "venueType", "scale"];
          */
          const whereClause: any = {};
          const {audienceType, venueType, scale} = filters || {};
          /*
          for (const key of Object.keys(filters)) {
            if (!allowedQueryParams.includes(key)) {
              throw new ValidateError();
            }
          }
          
          if(audienceType && !audienceTypeList.includes(audienceType))
            throw new ValidateError();

          if(venueType && !venueTypeList.includes(venueType))
            throw new ValidateError();

          if(scale && !scaleList.includes(scale))
            throw new ValidateError();
          */
          // Асигнування умови лише якщо вони передані в запиті
          if (audienceType) whereClause.audienceType = audienceType;
          if (venueType) whereClause.venueType = venueType;
          if (scale) whereClause.scale = scale;
        
          const data = await this.EventSeries.findAll({
            where: whereClause,
            raw: true // повернення простого json-обʼєкта (без методів, без стану та можливості взаємодіяти з БД)
          });
          //throw new Error("Service error smh");

        return data;
    }

    public createEventSeries = async(data) => {
        return await this.EventSeries.create(data);
    }
}