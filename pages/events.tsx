import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from "../components/layout";
//import sequelize from "../lib/sequelize";
//import { EventModel } from "../Server/Models/Event";
//import { initAssociations } from '../Server/Models/associations';
import { Field, Form, Formik } from "formik";
//import { api } from "../lib/api";
//import { models } from "../Server/Models/index";
//import { sequelizeModels } from "../Server/Models/createModels";
//import IContextContainer from 'Server/DI/Interfaces/IContextContainer';
import { IEvent } from '@/Server/Models/Event';
//import { AppState } from '@/Server/Store/ReduxStore';
import Store from '@/Server/Store/Store';
import { useDispatch, useSelector } from 'react-redux';
//import container from "../lib/container";
/*
export async function getServerSideProps(context) {
  await import("Server/Models/createModels");
  const containerModule = await import("Server/DI/container");
  const container = containerModule.default; 
  const cradle: IContextContainer = container.cradle;
  
  const {seriesId} = context.query;  
  //const Event = EventModel({ db: sequelize });
  //const {Event, EventSeries} = initAssociations(sequelize)
  
  //const {Event, EventSeries} = models;
  const { Event, EventSeries } = cradle;
  
  const include = {
    model: EventSeries,
    as: "series", // alias звʼязок між таблицями 1:М між Event та EventSeries
    required: false, // виведення всіх подій, навіть якщо деякі з них не мають серій
  };

  let events;
  if(seriesId){
    events = await Event.findAll({ 
      where: { seriesid: seriesId, statusevent: "active"},
      include: [include],
      order: [["id", "ASC"]]});
    //console.log(events);
  }
  else{
    events = await Event.findAll({ 
      where: {statusevent: "active"},
      include: [include],
      order: [["id", "ASC"]]}); // повернення простого json-обʼєкта
    //console.log(events);
  }

  // спеціальні обʼєкти (instances), вони містять прототипи, методи, внутрішні поля, складні вкладені обʼєкти
  // оскільки був використаний include і це без "raw: true" (який повертає JS-обʼєкти)
  return {
    props: {
      events: JSON.parse(JSON.stringify(events)) // JSON рядок -> JSON обʼєкт
    }
  };
}
*/
type EventResponse = {
  events: IEvent[],
  seriesid: number | null
}
export const getServerSideProps = Store.getServerSideProps(
  [
    {
      controller: "eventController",
      redux: "events"
    }
  ]
)
export default function EventsPage({ data }) {
  const dispatch = useDispatch();
  const reduxData1 = useSelector((state: any) => state.entities.events); // стан в ReduxStore є обʼєктом {entities: {tickets: {data: {getTickets: {tickets, id}}, error, loading}}}
  console.log("redux1data1", reduxData1)
  const eventsRedux = reduxData1?.data?.getEventList?.events;
  console.log("eventsRedux", eventsRedux)

  //const router = useRouter();
  /*
  const seriesId =
    typeof router.query.seriesId === "string"
      ? router.query.seriesId
      : undefined;
  */
  const seriesId = data.getEventList.seriesid;
  const [filters, setFilters] = useState({
    audienceType: "",
    venueType: "",
    scale: "",
  });
  /*
  console.log("data", data);
  console.log("data.getEventList", data.getEventList);
  console.log("data.getEventList.events", data.getEventList.events);
  */
  const[user] = useState(data.identity)

  //const [evnts, setEvents] = useState(data.getEventList.events);
  const [evnts, setEvents] = useState([])
  useEffect(() => {
    console.log("PAGE MOUNTED");
  }, []);

  const fetchAllData = async () => {
    try {
      /*console.error("Start fetch");
      const res = await fetch(`/api/events`);
      const data = await res.json();
      console.error("End fetch");
      if (Array.isArray(data)) {
        setEvents(data);

        setFilters({
          audienceType: "",
          venueType: "",
          scale: "",
        });
      }
      */
      
      //console.error("Start fetch");
      //const data = await api.xRead<IEvent[]>("events");
      //console.error("End fetch");

      //const data = await api.xRead<{getEventList: EventResponse}>("events");
      //setEvents(data.getEventList.events);
      setFilters({
          audienceType: "",
          venueType: "",
          scale: "",
      });
      dispatch({type: "events/FETCH_REQUEST", payload: {}})
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchFilteredData = async (currentFilters, seriesId?) => {
    //try {
    /*
      const cleanFilters = Object.fromEntries( // перетворення обʼєкта у масив
        Object.entries(currentFilters).filter(([_, v]) => v !== "") // видалення зайвих пустих значень й повернення у обʼєкт
      ) as Record<string, string>; // запобігання відправлення пустих фільтрів до API 

      if (seriesId) {
        cleanFilters.seriesId = String(seriesId);
        console.log(cleanFilters.seriesId)
      }
      const query = new URLSearchParams(cleanFilters).toString();
      console.log(query) 
      console.log(seriesId) */

      // формування query (рядок параметрів, що йде після ? в url) на основі запиту користувача у пошуковому рядку
      
      /*const url = query ? `/api/events?${query}` : `/api/events`; // формування повної адреси запиту звертання 

      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data)) {
        setEvents(data);
      }*/
      /*
      const url = query ? `events?${query}` : `events`;
      //const data = await api.xRead<IEvent[]>(url);
      const data = await api.xRead<{getEventList: EventResponse}>(url);
      setEvents(data.getEventList.events);*/

      dispatch({type: "events/FETCH_REQUEST", payload: {currentFilters, ...(seriesId ? {seriesId} : {})}})

    /*} catch (error) {
      console.error("Filter error:", error);
    }*/
  };

  function Toggle(e) {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  
  useEffect(() => { // виклик кожен раз, коли змінюються параметри фільтрації
    const hasFilters = Object.values(filters).some(Boolean); // перевірка наявності фільтрів

    if (!hasFilters) return;

    fetchFilteredData(filters); // автоматичний виклик методу, що робить fetch даних з відповідними фільтрами
  }, [filters]);
  
  //const uniqueId = new Set(evnts.map(e => e.seriesid))
  const eventsReduxArray = Array.isArray(eventsRedux) ? eventsRedux : [];
  const uniqueId = new Set(eventsReduxArray?.map(e => e.seriesid))
  const filterShow = uniqueId.size > 1 ? true : false;
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
    
      <h1 style = {{display: "flex", justifyContent: "center"}}>Events</h1>
      <p>{uniqueId.size}</p>
      {/*<div>
        <button onClick={() => fetchFilteredData(filters)}>Fetch</button>
        <button onClick={fetchAllData}>Reset</button>
      </div>*/}
        {/*{filterShow && ( <div style = {{display: "flex", justifyContent: "space-between"}}>
       <div>
          <p>Audience type</p>
          <input type = "radio" name = "audienceType" value = "professional" onChange={Toggle}/>professional
          <input type = "radio" name = "audienceType" value = "niche" onChange={Toggle}/>niche
          <input type = "radio" name = "audienceType" value = "general" onChange={Toggle}/>general
          <input type = "radio" name = "audienceType" value = "youth" onChange={Toggle}/>youth
          <input type = "radio" name = "audienceType" value = "adult" onChange={Toggle}/>adult
        </div>
        <div>
          <p>Venue type</p>
          <input type = "radio" name = "venueType" value = "indoor" onChange={Toggle}/>indoor
          <input type = "radio" name = "venueType" value = "outdoor" onChange={Toggle}/>outdoor
          <input type = "radio" name = "venueType" value = "mixed" onChange={Toggle}/>mixed
        </div>
        <div>
          <p>Scale</p>
          <input type = "radio" name = "scale" value = "local" onChange={Toggle}/>local
          <input type = "radio" name = "scale" value = "regional" onChange={Toggle}/>regional
          <input type = "radio" name = "scale" value = "international" onChange={Toggle}/>international
          <input type = "radio" name = "scale" value = "global" onChange={Toggle}/>global
        </div>
      </div>)}*/}

      
      {<Formik
        initialValues={{
          audienceType: "",
          venueType: "",
          scale: ""
        }}

        onSubmit={(values) => {fetchFilteredData(values, seriesId)}}
        >
          {({resetForm, values}) => (
        <>
          <Form>
              { filterShow && (
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

            
          )}
            { filterShow && <button type="submit">
              Apply filters
            </button>}
        </Form>
        <div>

        </div>
        { /*{ filterShow && (   <div>
            <button
          type="button"
          onClick={() => {
            resetForm();

            fetchAllData()
          }}
        >
          Reset
        </button>
        </div>)}*/}
        <div>
            <button
          type="button"
          onClick={() => {
            resetForm();

            fetchAllData()
          }}
        >
          Reset
        </button>
        {!filterShow && (<button onClick = {() => fetchFilteredData(filters, seriesId)}>
          Fetch
        </button>)}
        </div>
        </>
        )}
      </Formik>}
    <div style = {{display: "flex",  alignItems: "center",  flexDirection: "column", justifyContent: "center"}}>
     {eventsReduxArray.map((e: any) => ( // початок роботи з основним масивом даних (події)
    <div
      key={e.id}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px",
        background: "red",
        minHeight: "150px",
        width: "450px",
        borderRadius: "10px",
        color: "white",
        fontSize: "12px",
        textAlign: "center",
        padding: "10px"
      }}
    > 
      <p>ID: {e.id}</p>
      <p>Name: {e.eventName}</p>
      <p>Location: {e.locationName}</p>
      <p>Address: {e.locationAddress}</p>
      <p>Date: {e.startDate}</p>
      
      {e.series && ( // виведення даних серії подій, однією з яких є певний ітераційний івент
        <>
          <p>Scale: {e.series.scale}</p>
          <p>Venue: {e.series.venueType}</p>
          <p>Audience: {e.series.audienceType}</p>
        </>
      )}

      <Link href={`/tickets?eventid=${e.id}`}>
        <button>Go</button>
      </Link>
    </div>
  ))}
    </div>
    </Layout>
  );
}