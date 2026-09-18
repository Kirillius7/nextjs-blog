//
import { AnswerType } from "@/Server/Exceptions";
//
import { toast } from "react-toastify";
class XFetchError extends Error { // створення кастомного класу для обробки fetch помилки на основі успадковування класу помилки
  // такий підхід дозволяє використовувати instanceof XFetchError у блоках catch для того, щоб відрізнити це від іншого типу
  public readonly status: number;
  public details?: any; // 👈 Додаємо це поле!
  constructor(message: string, status: number, details?: any) { 
    super(message || "Request failed"); // визначення повідомлення на виявлення помилки + ініціалізація механізмів 
    // (Stack Trace - ланцюг викликів) -> шлях викликів функцій у програмі до моменту виникнення помилки
    this.name = "XFetchError"; // визначення імʼя помилки (замість стандартного name === "Error") для полегшення дебагу
    this.status = status;
    this.details = details; // 👈 Зберігаємо деталі помилок
  }
}

type Method = "GET" | "POST" | "DELETE"; // створення власного типу для визначення HTTP методу і уникнення помилок в подальшому при оголошенні

// cтворення словника, де зазначені контролери і відповідні для них шляхи-файли в папці api
// const для того, щоб після збірки проекту змінна не зникла (на відміну від type, з якою можна б було використати одразу keyof)

// створення універсального типу відповіді Api на основі generics на запит з переліком: індикатор успішності, повідомлення, інформація
// оскільки відповідь від сервера це просто довгий рядок з переліком певних даних (success, message, data)
type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T; // відповідь Api з будь-яким типом даних 
};

class ApiClient { // клас, де зібрана логіка роботи з fetch, обробкою помилок, JSON parsing
  // приватний метод для запобігання роботи користувача з низькорівневим методом (api.xSave замість api.xFetch)
  private async xFetch<TResponse = any, TBody = unknown>( // any - дозволяє будь-який тип без перевірок, unknown - вимагає її
    // відповідь API часто непередбачувана і ще не типізована, unknown тут вказаний, щоб змусити явно описати, що відправляє розробник
    // параметри функції
    url?: string,
    method: Method = "GET", // дефолтне значення 
    body?: TBody,
    force?: boolean // прапорець для "обходу" кешу, щоб зробити "примусовий" запит, а не брати дані з кешу
  ): Promise<TResponse> { // тип повернення функції, оскільки xFetch є асинхронним методом, то він завжди повертає Promise
    if (!url) throw new Error("xFetch: no url");
    const baseURL = typeof window === "undefined" ? "http://localhost:3000" : ""; 
    // робота на сервері (node.js, ssr, getServerSideProps) чи у браузері (tsx, react, client side)
    //const response = await fetch("/api/" + url, { // обʼєкт відповіді fetch
    const response = await fetch(`${baseURL}/api/${url}`, { 
      method,
      headers: { // мета-інформація про запит, відправка json (сервер повинен розуміти, що треба розпарсити JSON.parse())
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined, // перетворення обʼєкта в тип JSON-рядок { "..." : ... } і відправка по http
    });

    const text = await response.text(); // результат витягує відповідь (json, пустота чи помилка), яка приходить як поток даних, як звичайний текст 

    let res: ApiResponse<TResponse>; // типізація структури, створення розпарсеного обʼєкта, що містить структуру "контейнера": success, message, data 

    try { 
      res = JSON.parse(text); // JSON-рядок перетворюється назад в object з урахуванням можливості отримати текст помилки для обробки XFetchError
      console.log("PARSED RESPONSE:", res);
      console.log("PARSED DATA:", res.data);
    } catch {
      throw new XFetchError("Invalid JSON from server", response.status); // обробка помилки парсингу (формат відповіді неможливо на json змінити)
    }

    if (!response.ok || !res.success) { // ok - 200, 201, 204 / !ok - 404, 500, 403, 401
      // 1) помилка на рівні HTTP, аналіз отриманого коду  2) обробка відповіді на основі структури JSON

      /*  
      throw new XFetchError(res.message || "Request failed", response.status);
      */

      // перевірка на наявність масиву помилок від перевірки схеми ajv 
      //const validationDetails = (res as any).details || (res as any).errors;
      const validationDetails = (res as any).error?.details
      const errorHandling = response.headers.get("X-Error-Handling");
      const toastMessage = res.message || "Request failed";
      console.log("errorHandling", errorHandling)
      // 2. Показуємо Toast, якщо ми на клієнті (браузері)
      console.log("TOAST MESSAGE:", toastMessage);
      //if (typeof window !== "undefined" && (res as any).error.answer === "toast") {
      if (typeof window !== "undefined" && errorHandling === AnswerType.Toast) {
        toast.error(toastMessage);
        //toast.error((res as any).error.answer)
      }

      throw new XFetchError(res.message || "Request failed", response.status, validationDetails);
    }

    return res.data as TResponse; // типізація відповіді для повернення її типу TResponse + заздалегідь оголошення властивості 
  }

  public xRead<T>(
    //url?: string,
    url: string,    
    params?: Record<string, any>, // параметри запиту в url, де ключ - рядок, а значення - будь-яке (number, string, object)
    method: Method = "GET",
    body?: object,
    force?: boolean
  ) {
    /*let url:string = routes[controller]
    if(params && Object.keys(params).length > 0){ // перевірка наявності переданих параметрів
      const cleanFilters = Object.fromEntries(// перетворення обʼєкта у масив значень [["key": value], ["key": value]]
      // такий підхід забезпечує можливість видалення "пустих" параметрів, які відображені як false (обʼєкт фільтрів передається повністю)
      Object.entries(params).filter(([_, v]) => v));
      const query = new URLSearchParams(cleanFilters).toString(); 
      // створення запису query завдяки перетворенню на рядок + використання URLSearchParams для "зшиття" через & і ? із заміною специфічних символів
      if(query){
        url = `${url}?${query}`; // формування рядку запиту для fetch на основі шляху і потенційних фільтрів
      }
    }*/
    return this.xFetch<T>(url, method, body, force);
  }

  // TResponse - тип даних, які приходять від сервера (data ApiResponse), це може бути обʼєкт, масив, void
  // TBody - відповідь, де вказано any як значення за замовчуванням для типу 
  // body: TBody = {} as TBody
  public xSave<TResponse, TBody = any>(url?: string, body?: TBody) { // приведення типу параметра body як TBody навіть якщо {}
  // інколи body {}, оскільки інколи команда POST треба для виконання дії, а не передачі даних, автоматичного створення запису, передачі даних по url
    return this.xFetch<TResponse>(url, "POST", body);
  }

  public xDelete<T>(url?: string) {
    return this.xFetch<T>(url, "DELETE"); 
  }
}

export const api = new ApiClient();