//import { models } from "Server/Models";
//import IContextContainer from "Server/DI/Interfaces/IContextContainer";
import { EventType } from "Server/Models/Event";
import { Event_SerieType } from "Server/Models/Event_Series";
//import { ValidateError } from "../Exceptions";

export class EventService {
    private Event: any;
    private EventSeries: any;

    constructor({Event, EventSeries} : {Event: EventType, EventSeries: Event_SerieType}) {
      this.Event = Event;
      this.EventSeries = EventSeries;
    }
  
    public getEventList = async(filters: any = {}) => {
    //public getEventSeriesList = async(filters) => { -> test
        const { audienceType, venueType, scale, seriesId } = filters || {};
        console.log("asd");

        /*
        const allowedQueryParams = ["seriesId", "audienceType", "venueType", "scale"];
        const audienceTypeList = ["professional", "niche", "general", "youth", "adult"];
        const venueTypeList = ["indoor", "outdoor", "mixed"];
        const scaleList = ["local", "regional", "international", "global"];

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

          const seriesWhere: any = {};
          if (audienceType) seriesWhere.audienceType = audienceType;
          if (venueType) seriesWhere.venueType = venueType;
          if (scale) seriesWhere.scale = scale;
          /*
          if(seriesId !== null && seriesId !== "" && seriesId !== undefined){
              if(!/^\d+$/.test(String(seriesId)))
                  throw new ValidateError();
          }*/
          if (seriesId) {
            seriesWhere.id = Number(seriesId);
          }
          const hasFilters = Object.keys(seriesWhere).length > 0; // підрахунок кількості ключів у фільтрах, якщо більше 0 - true
          const include: any = {
            model: this.EventSeries,
            as: "series", // alias звʼязок між таблицями 1:М між Event та EventSeries
            required: false, // виведення всіх подій, навіть якщо деякі з них не мають серій
          };
        
          if (hasFilters) {
            include.required = true; // виведення подій, тільки якщо вони є частиною серій
            include.where = seriesWhere;
          }
          //const data = await this.Event.findAll({
          const events = await this.Event.findAll({
            where: { statusevent: "active" },
            include: [include], // додавання до таблиці Event поле series з відповідними параметрами
            order: [["id", "ASC"]],
            raw: true
          });
          //return data;
          //return events.map(event => event.toJSON());
          return events;
    }
}