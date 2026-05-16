/*import sequelize from "../../lib/sequelize";
import { Event_ArtistModel } from "../../Server/Models/Event_Artist";

export default async function handler(req, res) {
  try {
    const Event_Artist = Event_ArtistModel({ db: sequelize });
    const event_artists = await Event_Artist.findAll();
    res.status(200).json(event_artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}*/