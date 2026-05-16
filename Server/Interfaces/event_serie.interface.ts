import { BuildOptions, Model } from "sequelize";

export interface IEvent_Serie extends Model{
    readonly id: number;
    name: string;
    description: string;
    audience_type: 'general' | 'youth' | 'adult' | 'professional' | 'niche';
    venue_type: 'indoor' | 'outdoor' | 'mixed'
    scale: 'local' | 'regional' | 'international' | 'global'
}

export type Event_SerieType = typeof Model & {
  new (values?: object, options?: BuildOptions): IEvent_Serie;
};