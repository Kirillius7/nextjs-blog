class XFetchError extends Error { // створення кастомного класу для обробки fetch помилки на основі успадковування класу помилки
  // такий підхід дозволяє використовувати instanceof XFetchError у блоках catch для того, щоб відрізнити це від іншого типу
  constructor(message?: string) { 
    super(message || "Request failed"); // визначення повідомлення на виявлення помилки + ініціалізація механізмів 
    // (Stack Trace - ланцюг викликів) -> шлях викликів функцій у програмі до моменту виникнення помилки
    this.name = "XFetchError"; // визначення імʼя помилки (замість стандартного name === "Error") для полегшення дебагу
  }
}

type Method = "GET" | "POST" | "DELETE"; // створення власного типу для визначення HTTP методу і уникнення помилок в подальшому при оголошенні

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

    const response = await fetch("/api/" + url, { // обʼєкт відповіді fetch
      method,
      headers: { // мета-інформація про запит, відправка json (сервер повинен розуміти, що треба розпарсити JSON.parse())
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined, // перетворення обʼєкта в тип JSON { "..." : ... }
    });

    const text = await response.text(); // результат витягує відповідь (json, пустота чи помилка), яка приходить як поток даних, як звичайний текст 

    let res: ApiResponse<TResponse>; // типізація структури, створення розпарсеного обʼєкта, що містить структуру "контейнера": success, message, data 

    try { 
      res = JSON.parse(text); // JSON text перетворюється в object з урахуванням можливості отримати текст помилки для обробки XFetchError
    } catch {
      throw new XFetchError("Invalid JSON from server");
    }

    if (!response.ok || !res.success) { // ok - 200, 201, 204 / !ok - 404, 500, 403, 401
      // 1) помилка на рівні HTTP, аналіз отриманого коду  2) обробка відповіді на основі структури JSON
      throw new XFetchError(res.message || "Request failed");
    }

    return res.data as TResponse; // типізація відповіді для повернення її типу TResponse + заздалегідь оголошення властивості 
  }

  public xRead<T>(
    url?: string,
    method: Method = "GET",
    body?: object,
    force?: boolean
  ) {
    return this.xFetch<T>(url, method, body, force);
  }

  // TResponse - тип даних, які приходять від сервера (data ApiResponse), це може бути обʼєкт, масив, void
  // TBody - відповідь, де вказано any як значення за замовчуванням для типу 
  public xSave<TResponse, TBody = any>(url?: string, body: TBody = {} as TBody) { // приведення типу параметра body як TBody навіть якщо {}
  // інколи body {}, оскільки інколи команда POST треба для виконання дії, а не передачі даних, автоматичного створення запису, передачі даних по url
    return this.xFetch<TResponse>(url, "POST", body);
  }

  public xDelete<T>(url?: string) {
    return this.xFetch<T>(url, "DELETE"); 
  }
}

export const api = new ApiClient();