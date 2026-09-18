import type IContextContainer from "Server/DI/Interfaces/IContextContainer";

export default class BaseContext  {
  protected di: IContextContainer; // типізація для доступу тих обʼєктів, які додати до контейнера
  // робота з обʼєктом, який передає awilix при створенні класу 
  // це дає доступ до всіх доданих до контейнера контролерів, сервісів, моделей
  constructor(opts: IContextContainer) {
    this.di = opts;
  }
}