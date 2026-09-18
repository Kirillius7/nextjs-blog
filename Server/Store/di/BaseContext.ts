import { IClientContainer } from "./IClientContainer";
export default class BaseContext  {
  protected di: IClientContainer

    constructor(opts: IClientContainer) {
        this.di = opts;
    }
}