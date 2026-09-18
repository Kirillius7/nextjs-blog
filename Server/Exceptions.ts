import { StatusCodes } from "http-status-codes";

export enum AnswerType {
  Log = "log", // "тихі" помилки для системи моніторингу (Sentry/Datadog)
  Toast = "toast", // користувацькі помилки у вигляді спливаючого сповіщення на екрані
}

export interface ApiErrorOptions {
  code: number;
  answer?: AnswerType; 
  // тост (спливаюче повідомлення), модальне вікно (діалогове вікно, що блокує роботу поки користувач не зробить дію) 
  // чи сповіщення (вбудоване повідомлення на самій сторінці (банер зверху або червоний текст під конкретним полем). Не зникає само, але не блокує навігацію)
  params?: Record<string, string | number>; // опціональний обʼєкт з додатковими динамічними даними ({ minLength: 8 })
  /* 
  params: {
    required: 150,     // number
    current: 50,       // number
    currency: "UAH"    // string
  }
  */

  //
  details?: any // пункт для виведення невалідаційних даних з форм 
}

export class ServerError extends Error{
    public readonly code: number;
    public readonly answer: AnswerType;
    public readonly params?: Record <string, string | number>;

    //
    public readonly details?: any;

    constructor(mess: string, options: ApiErrorOptions){
        super(mess)
        this.code = options.code;
        this.answer = options.answer ?? AnswerType.Toast;
        this.params = options.params;
        //
        this.details = options.details
    }
    public get options() : ApiErrorOptions{
        return{
          code: this.code,
          answer: this.answer,
          params: this.params,
          details: this.details
        }
    }
}

export class UnauthorizedError extends ServerError {
  constructor(message?: string, options?: {answer?:any}) {
    super(
      message ?? "You need to sign in to access this page.",
      { code: StatusCodes.UNAUTHORIZED,
        answer: options?.answer ?? AnswerType.Log
      }
    );
  }
}

export class ValidateError extends ServerError {
  constructor(message?: string, options?: {details?: any, answer?: any}) { // повідомлення + помилки валідаційні
    super(
      message ?? "The request contains invalid or incomplete data",
      { code: StatusCodes.BAD_REQUEST,
        details: options?.details,
        answer: options?.answer ?? AnswerType.Toast
      }
    );
  }
}

export class AccessDeniedError extends ServerError{
  constructor(message?: string, options?: {answer?:any}){
    super(
      message ?? "You don't have the rights to enter the page",
      {
        code: StatusCodes.FORBIDDEN,
        answer: options?.answer ?? AnswerType.Toast
      }
    )
  }
}

export class NotFound extends ServerError{
  constructor(message?: string, options?: {answer?:any}){
    super(
      message ?? "The requested resource was not found on this server.",
      {
        code: StatusCodes.NOT_FOUND,
        answer: options?.answer ?? AnswerType.Log
      }
    )
  }
}

export class InternalServerError extends ServerError{
  constructor(message?: string, options?: {answer?:any}) {
    super(
      message ?? "An internal server error occurred while processing your request.", {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        answer: options?.answer ?? AnswerType.Log
      }
    );
    
  }
}

export class ConflictError extends ServerError {
  constructor(message?: string, options?: { answer?: any }) {
    super(
      message ?? "User with this email already exists", 
      {
        code: StatusCodes.CONFLICT, // 409
        answer: options?.answer ?? AnswerType.Toast
      }
    );
  }
}