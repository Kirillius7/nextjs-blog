import { models } from "Server/Models";

export class EventService {
    public getEventList = async(filters) => {
        const { audienceType, venueType, scale, seriesId } = filters;
          //const { Event, EventSeries } = req.models;
          const {Event, EventSeries} = models;
          const seriesWhere: any = {};
          if (audienceType) seriesWhere.audienceType = audienceType;
          if (venueType) seriesWhere.venueType = venueType;
          if (scale) seriesWhere.scale = scale;
          if (seriesId) {
            seriesWhere.id = Number(seriesId);
          }
          const hasFilters = Object.keys(seriesWhere).length > 0; // підрахунок кількості ключів у фільтрах, якщо більше 0 - true
          const include: any = {
            model: EventSeries,
            as: "series", // alias звʼязок між таблицями 1:М між Event та EventSeries
            required: false, // виведення всіх подій, навіть якщо деякі з них не мають серій
          };
        
          if (hasFilters) {
            include.required = true; // виведення подій, тільки якщо вони є частиною серій
            include.where = seriesWhere;
          }
        
          const data = await Event.findAll({
            where: { statusevent: "active" },
            include: [include], // додавання до таблиці Event поле series з відповідними параметрами
            order: [["id", "ASC"]],
          });

          return data;
    }
}