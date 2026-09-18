import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
//import sequelize from "../lib/sequelize";
//import { Event_SerieModel } from "../Server/Models/Event_Series";
import { IEvent } from "@/Server/Models/Event";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import { IEvent_Serie } from "../Server/Models/Event_Series";
import Store from "../Server/Store/Store";
//import { models } from "../Server/Models/index";
//import { sequelizeModels } from "../Server/Models/createModels";

//export async function getServerSideProps(сtx) {

  //const Event_Serie = Event_SerieModel({ db: sequelize });
  
  // Тепер імпортуємо контейнер (теж динамічно або звичайним імпортом зверху, 
  // але динамічно всередині функції надійніше, щоб уникнути каші в бандлі)

  /*
  const containerModule = await import("Server/DI/container");
  const container = containerModule.default;
  const cradle: IContextContainer = container.cradle;
  
  const {EventSeries} = cradle;
  const event_series = await EventSeries.findAll({ raw: true });

  return {
    props: { event_series },
  };
  */

  /*
  const result = await api.xRead<IEvent_Serie[]>("event_series");

  return {
    props: {
      event_series: result
    }
  }
}*/

// api: браузер -> http-запит -> nodejs (отримав запит і передав далі) -> nextjs -> пошук api файлу -> handler (url/шлях дозволяє знайти файл handler)
// react -> fetch() -> url -> nextjs виконує пошук api файл -> handler -> basecontroller (req для визначення шляху і запиту)
// ssr: localhost:3000/series -> запит (get/series) -> nodejs (отримав запит і передав далі) -> nextjs -> пошук pages файлу -> getserversideprops
// nextjs уже знайшов потрібну сторінку tsx -> виклик getserversideprops -> виклик handler (req.req ) для визначення шляху і запиту
export const getServerSideProps = Store.getServerSideProps( // context (req, res) передається разом з параметрами до Store
  //["eventSeriesController", "eventController"] // контролери (обробка даних)
  //"eventSeriesController"
  // реалізований підхід, де сторінка може мати декілька контролерів, адже це допоможе запустити events, artists, news в 1 місці
  [{controller: "eventSeriesController", route: "/series"}, {controller: "eventController", route: "/events"}]
) 
// на етапі запуску сервера - асигнування методу, на етапі виклику - програма вже знає шлях, який метод треба викликати
// store отримує параметри, а повертає асинхронну функцію getServerSideProps(context), виконання якої буде з використанням
// context (req, res) та параметрів (container, "/series", "eventSeriesController") - контейнер, шлях, контролер
// getServerSideProps = async(context) => {}
type SeriesResponse = {
  eventseries: IEvent_Serie[],
  events: IEvent[]
}
export default function Event_SeriesPage({ data }: any) {
  /*
  console.log("data", data);
  console.log("data.getEventSeriesList", data.getEventSeriesList.eventseries);
  console.log("data.getEventList", data.getEventList.events);
  */

  //console.log("data", data);

  const[e_series, setE_series] = useState(data.getEventSeriesList.eventseries);
  const[user] = useState(data.identity)
  const[filters] = useState({audienceType: "", venueType: "", scale: ""})
  
  useEffect(() => {
    console.log("PAGE MOUNTED");
    console.dir( // запис внутрішньої структури обʼєкта (log виводить [object/array], якщо обʼєкт глибокий)
      Object.fromEntries( // перетворення модифікованого масиву пар в js-обʼєкт
        Object.entries(data).map(([key, value]) => [ // перетворення обʼєкту на масив пар (ключ-значення)
          // проходження по кожній створеній парі, де є перевірка value - якщо масив, то перші 10 значень, інакше - весь value
          key,
          Array.isArray(value) ? value.slice(0, 10) : value
        ])
      ),
      { depth: null } // команда для Node.js, щоб вивести об'єкт на всю глибину
    );
  }, []);
  const fetchAllData = async () => {
    try {
      /*const res = await fetch(`/api/event_series`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setE_series(data);
        console.log("Success fetch all data!")
      }*/
      
      //const data = await api.xRead<{getEventSeriesList: IEvent_Serie[]}>("event_series");
      // єдиний підхід до формування запиту (ssr/api), унеможливлює вирогідність помилки під час запису шляху до api файлу
      // для api запиту потрібний http-запит через мережеву карту із чітко зазначеною адресою (на основі цього сервер nextjs шукає потрібний файл)
      const data = await api.xRead<{getEventSeriesList: SeriesResponse}>("event_series");
      console.log("data", data.getEventSeriesList.events)
      setE_series(data.getEventSeriesList.eventseries);
      console.log("Success fetch all data!")
    } catch (error) {
      console.error("Помилка отримання всіх даних:", error);
    }
  };

  const fetchFilteredData = async (currentFilters) => {
    try {
      /*const cleanFilters = Object.fromEntries(// перетворення обʼєкта у масив
        Object.entries(currentFilters).filter(([_, v]) => v) // видалення зайвих пустих значень й повернення у обʼєкт
      ) as Record<string, string>; // запобігання відправлення пустих фільтрів до API 

      const query = new URLSearchParams(cleanFilters).toString();*/
      // формування query (рядок параметрів, що йде після ? в url) на основі запиту користувача у пошуковому рядку
      
      /*
      const url = query ? `/api/event_series?${query}` : `/api/event_series`; // формування повної адреси запиту звертання 
      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data)) {
        setE_series(data);
        console.log("Success filter!")
      }
      */
      
      const cleanFilters = Object.fromEntries(// перетворення обʼєкта у масив значень [["key": value], ["key": value]]
      // такий підхід забезпечує можливість видалення "пустих" параметрів, які відображені як false (обʼєкт фільтрів передається повністю)
      Object.entries(currentFilters).filter(([_, v]) => v)) as Record<string, string>;
      const query = new URLSearchParams(cleanFilters).toString(); 
      const url = query ? `event_series?${query}` : `event_series`;
      //const data = await api.xRead<{getEventSeriesList: IEvent_Serie[]}>("eventSeriesController", currentFilters);
      const data = await api.xRead<{getEventSeriesList: SeriesResponse}>(url);
      console.log("data", data)
      setE_series(data.getEventSeriesList.eventseries);
      console.log("Success filter!")
    } catch (error) {
      console.error("Помилка фільтрації:", error);
    }
  };
  /*
  function Toggle(e) {
    const { name, value } = e.target;

    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }*/
  const [form, setForm] = useState({
    name: "",
    description: "",
    audienceType: "",
    venueType: "",
    scale: ""
  })
  // 1. Стейт для зберігання помилок конкретних полів
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e) =>{
    const {name, value} = e.target; // робота з html-елементом, деструктурізація імені та значення input
    setForm(prev => ({ // зміна даних на основі імені з оновленим значенням від html-елемента
      ...prev,
      [name]: value
    }))
    
    // прибрати помилку у разі зміни введених даних
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  const submitForm = async(e) => {
    e.preventDefault() // блок перезавантаження сторінки під час submit
    try{
      console.log("form", form)
      await api.xSave("event_series", form)
      toast.success('Data has been successfully transfered!');
      //const data = await api.xRead<IEvent_Serie[]>("event_series");
      //setE_series(data);
      setE_series(res => [...res, form])
    }
    catch (error: any) {
      console.log("FULL ERROR OBJECT:", error);
      console.log("ERROR DETAILS:", error?.details);

      // збір деталей помилки
      const details = error?.details 
      //|| error?.response?.details || error?.data?.details;

      if (Array.isArray(details)) {
        const errorsMap: Record<string, string> = {};

        details.forEach((errorItem: any) => {
          //console.log("errorItem.params",errorItem.params.limit)
          //let fieldName = "";
          const fieldName = errorItem.instancePath ? errorItem.instancePath.replace(/^\//, "") :
            errorItem.params?.missingProperty;
          /*
          if (errorItem.instancePath) {
            fieldName = errorItem.instancePath.replace(/^\//, "");
          } else if (errorItem.keyword === "required" && errorItem.params?.missingProperty) {
            fieldName = errorItem.params.missingProperty;
          }
          */
          if (fieldName) {
            errorsMap[fieldName] = errorItem.message;
          }
        });

        setFieldErrors(errorsMap);
      }
    }
  }

  useEffect(() => {
  // якщо всі фільтри пусті нічого не відбувається
  const hasFilters = Object.values(filters).some(v => v);

  if (hasFilters) {
    fetchFilteredData(filters);
  }
}, [filters]);

  const audienceOptions = [
    "professional",
    "niche",
    "general",
    "youth",
    "adult"
  ];

  const venueOptions = [
    "indoor",
    "outdoor",
    "mixed"
  ];

  const scaleOptions = [
    "local",
    "regional",
    "international",
    "global"
  ];

  return (
    <Layout props = {user}>
      <div style = {{display: "flex", justifyContent: "center"}}>
        <h1>EventSeries</h1>
      </div>
      {/*<div style = {{display: "flex", justifyContent: "flex-end", margin: "50px"}}>
        <button onClick={() => fetchFilteredData(filters)}>Fetch</button>
        <button onClick={fetchAllData}>Reset</button>
      </div>
      <div style = {{display: "flex", justifyContent: "space-between"}}>
        <div>
          <p>Audience type</p>
          <input type = "radio" name = "audienceType" value = "professional" onChange = {Toggle}/>professional
          <input type = "radio" name = "audienceType" value = "niche" onChange = {Toggle}/>niche
          <input type = "radio" name = "audienceType" value = "general" onChange = {Toggle}/>general
          <input type = "radio" name = "audienceType" value = "youth" onChange = {Toggle}/>youth
          <input type = "radio" name = "audienceType" value = "adult" onChange = {Toggle}/>adult
        </div>
        <div>
          <p>Venue type</p>
          <input type = "radio" name = "venueType" value = "indoor" onChange = {Toggle}/>indoor
          <input type = "radio" name = "venueType" value = "outdoor" onChange = {Toggle}/>outdoor
          <input type = "radio" name = "venueType" value = "mixed" onChange = {Toggle}/>mixed
        </div>
        <div>
          <p>Scale</p>
          <input type = "radio" name = "scale" value = "local" onChange = {Toggle}/>local
          <input type = "radio" name = "scale" value = "regional" onChange = {Toggle}/>regional
          <input type = "radio" name = "scale" value = "international" onChange = {Toggle}/>international
          <input type = "radio" name = "scale" value = "global" onChange = {Toggle}/>global
        </div>
      </div>*/}

      <Formik
        initialValues={{
          audienceType: "",
          venueType: "",
          scale: ""
        }}

        onSubmit={(values) => {fetchFilteredData(values)}}
        >
          {({resetForm, values}) => (
        <>
          <Form>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >

              {/* Audience type */}
              <div>
                <p>Audience type</p>

                {audienceOptions.map((option) => (
                  <label
                    key={option}
                    style={{
                      display: "block",
                      marginBottom: "5px"
                    }}
                  >
                    <Field
                      type="radio"
                      name="audienceType"
                      value={option}
                    />

                    {option}
                  </label>
                ))}
              </div>

              {/* Venue type */}
              <div>
                <p>Venue type</p>

                {venueOptions.map((option) => (
                  <label
                    key={option}
                    style={{
                      display: "block",
                      marginBottom: "5px"
                    }}
                  >
                    <Field
                      type="radio"
                      name="venueType"
                      value={option}
                    />

                    {option}
                  </label>
                ))}
              </div>

              {/* Scale */}
              <div>
                <p>Scale</p>

                {scaleOptions.map((option) => (
                  <label
                    key={option}
                    style={{
                      display: "block",
                      marginBottom: "5px"
                    }}
                  >
                    <Field
                      type="radio"
                      name="scale"
                      value={option}
                    />

                    {option}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit">
              Apply filters
            </button>
        </Form>
        <div>

        </div>
            <button
          type="button"
          onClick={() => {
            resetForm();

            fetchAllData()
          }}
        >
          Reset
        </button>
        </>
        )}
      </Formik>

      <div style = {{display: "flex", justifyContent: "center"}}>
        <form style={{display: "flex", flexDirection: "column", maxWidth: "300px"}}
          onSubmit={submitForm}>
<div>
          <input
            placeholder="Name series"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={{ width: "100%", borderColor: fieldErrors.name ? "red" : undefined }}
          />
          {fieldErrors.name && (
            <span style={{ color: "red", fontSize: "12px" }}>{fieldErrors.name}</span>
          )}
        </div>

        <div>
          <input
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{ width: "100%", borderColor: fieldErrors.description ? "red" : undefined }}
          />
          {fieldErrors.description && (
            <span style={{ color: "red", fontSize: "12px" }}>{fieldErrors.description}</span>
          )}
        </div>

        <div>
          <input
            placeholder="Audience type"
            name="audienceType"
            value={form.audienceType}
            onChange={handleChange}
            style={{ width: "100%", borderColor: fieldErrors.audienceType ? "red" : undefined }}
          />
          {fieldErrors.audienceType && (
            <span style={{ color: "red", fontSize: "12px" }}>{fieldErrors.audienceType}</span>
          )}
        </div>

        <div>
          <input
            placeholder="Venue type"
            name="venueType"
            value={form.venueType}
            onChange={handleChange}
            style={{ width: "100%", borderColor: fieldErrors.venueType ? "red" : undefined }}
          />
          {fieldErrors.venueType && (
            <span style={{ color: "red", fontSize: "12px" }}>{fieldErrors.venueType}</span>
          )}
        </div>

        <div>
          <input
            placeholder="Scale"
            name="scale"
            value={form.scale}
            onChange={handleChange}
            style={{ width: "100%", borderColor: fieldErrors.scale ? "red" : undefined }}
          />
          {fieldErrors.scale && (
            <span style={{ color: "red", fontSize: "12px" }}>{fieldErrors.scale}</span>
          )}
        </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      
       <div style = {{display: "flex",  alignItems: "center",  flexDirection: "column", justifyContent: "center"}}>
      {e_series.map((e: any, index: number) => (
    <div key={e.id ? `series-id-${e.id}` : `series-idx-${index}`} style={{
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center",     
        margin: "20px", 
        background: "red", 
        height: "150px",          
        width: "450px",           
        borderRadius: "10px",    
        color: "white",          
        fontSize: "12px",       
        textAlign: "center",
        padding: "10px"
        }}>
          {e.id}
          {e.name}
          {e.description}
          {e.audience_type}
          {e.venue_type}
          {e.scale}
          <Link href={`/events?seriesId=${e.id}`}>
            <button>Go</button>
          </Link>
        </div>
      ))}
    </div>
    </Layout>
  );
}