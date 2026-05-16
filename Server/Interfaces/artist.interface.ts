import { BuildOptions, Model } from "sequelize";

export interface IArtist extends Model {
    readonly id: number;
    stage_name: string;
    first_name: string;
    second_name: string;
    genre: string;
}

export type ArtistType = typeof Model & {
      new (values?: object, options?: BuildOptions): IArtist;
}