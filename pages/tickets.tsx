import { useState } from "react";
import Layout from "../components/layout";
//import sequelize from "../lib/sequelize";
//import { TicketModel } from "../Server/Models/Ticket";
//import { ITicket } from "Server/Models/Ticket";
import { Field, Form, Formik } from "formik";
//import { models } from "../Server/Models/index";
//import { sequelizeModels } from "../Server/Models/createModels";
//import IContextContainer from 'Server/DI/Interfaces/IContextContainer';
import Store from "@/Server/Store/Store";
//import { api } from "../lib/api";
import { AppState } from "../Server/Store/ReduxStore";
/*
export async function getServerSideProps(context) {
  const { eventid } = context.query;
  const containerModule = await import("Server/DI/container");
  const container = containerModule.default;
  //const Ticket = TicketModel({ db: sequelize });
  const cradle: IContextContainer = container.cradle;
  
  //const {Ticket} = models;
  const { Ticket } = cradle;
  let tickets;

  if (eventid)
    tickets = await Ticket.findAll({
      where: { eventid, statusticket: "available" },
      order: [["eventid", "ASC"]],
      raw: true,
    });
  else
    tickets = await Ticket.findAll({
      where: { statusticket: "available" },
      order: [["eventid", "ASC"]],
      raw: true,
    });

  const groupedTickets = tickets.reduce((acc: any, ticket: any) => { // перетворення масиву в обʼєкт
    // acc - об’єкт (результат), який містить ключі та значення, ticket - кожен елемент масиву {} - початкове значення
    const key = ticket.eventid; // угрупування на основі ключа події

    if (!acc[key]) 
      acc[key] = []; // якщо під певним key не існує масиву обʼєктів - треба створити пустий масив для додавання даних

    acc[key].push(ticket); // додавання обʼєкту ticket під певний key

    return acc; // передача обʼєкта на наступному кроці ітерації
  }, {}); // починаючи з порожнього обʼєкта

  return {
    props: {
      tickets: groupedTickets, // передача обʼєкта в React-компонент сторінки далі
      eventid: eventid || null
    },
  };
}
*/



//
import { useDispatch, useSelector } from 'react-redux';

export type ITicket = {
  id: number;
  eventid: number;
  priceperticket: number;
  statusticket: string;
  category: string;
};

export type TicketResponse = {
  tickets: ITicket[],
  eventId: number | null
}

export type GroupedTickets = Record<number, ITicket[]>;

/*
export const getServerSideProps = Store.getServerSideProps(
  "ticketController"
)*/

export const getServerSideProps = Store.getServerSideProps(
  [
      {
          controller: "ticketController",
          redux: "tickets"
      }
  ]
)
export default function TicketsPage({ data }) { // next.js самостійно викликає getServerSideProps та виводить props

  const dispatch = useDispatch(); // транспортний канал для відправки Action (подію) в Redux Store

  // зчитування даних з Store
  //const { data: reduxData, loading, error } = useSelector((state: AppState) => state.entities.tickets); // "підписка" на стан Store
  const reduxData1 = useSelector((state: AppState) => state.entities.tickets); // стан в ReduxStore є обʼєктом {entities: {tickets: {data: {getTickets: {tickets, id}}, error, loading}}}
  console.log("redux1data1", reduxData1)
  const reduxData = useSelector((state: any) => state.entities?.tickets);
  const ticketsRedux = reduxData?.data?.getTicketsList?.tickets || [];
  console.log('REDUX DATA:', reduxData);
  const loading = reduxData?.loading;
  const error = reduxData?.error;
  console.log('ticketsRedux', ticketsRedux);
  console.log('loading', loading);
  console.log('error', error);
  const tcktsFromProps = data.getTicketsList.tickets;
  console.log('tcktsFromProps DATA:', tcktsFromProps);

  //const reduxState = useSelector((state: any) => state);

  //console.log("REDUX STATE:", reduxState);


  /* working part
  //const[tckts, setTickets] = useState(data);
  console.log("DATA KEYS:", Object.keys(data));
  const {eventId} = data;
  const {eventid} = data;
  console.log("eventId",eventId)
  console.log("true or false", eventid === null)

  //console.log("FULL DATA", JSON.stringify(data, null, 2));
  const [tckts, setTickets] = useState<GroupedTickets>(data.getGroupedTicketList.tickets);
  //console.log("tickets", tckts);

  const [eventFilters, setEventFilters] = useState<{[eventId: number]: string;}>({});
  const [eventsCategory, setEventsCategory] = useState("");
  */ //working part
  
  /*console.log("data", data);
  console.log("data.getTicketsList", data.getTicketsList);
  console.log("data.getTicketsList.tickets", data.getTicketsList.tickets);*/

  const[user] = useState(data.identity);

  //const[tckts, setTickets] = useState(data.getTicketsList.tickets);
  const tckts = "";

  //const {eventid} = data.getTicketsList.eventid;
  const eventId = data.getTicketsList.eventId;

  const [eventFilters, setEventFilters] = useState<{[eventId: number]: string;}>({});
  const [eventsCategory, setEventsCategory] = useState("");


  // збереження для кожної події власного фільтра, оскільки у квитків лише 1 фільтр (категорія), то цього вистачить для роботи
const fetchAllData = async (eventId?: number) => {

  /*
    try {

        const url =
            eventId != null
                ? `tickets?eventid=${eventId}`
                : "tickets";
        const data = await api.xRead<{getTicketsList: TicketResponse}>(url);
    */
        /*
        console.log(data);
        console.log(Object.keys(data));
        console.log(data.getTicketList);
        console.log(data.getTicketList?.tickets);*/

        /* working
        console.log("true or false", eventid === null)
        setTickets(data.getTicketList.tickets);
        */

        /*
        setTickets(data.getTicketsList.tickets)

        setEventsCategory("");

    } catch (error: any) {
        console.error(error.message);
    }*/
   console.log('1. DISPATCH REQUEST');
  console.log("payload: { eventId }")

       dispatch({ 
      type: 'tickets/FETCH_REQUEST', 
      payload: eventId ? { eventid: eventId } : {}// корисне навантаження/дані для передачі 
    });
    // dispatch (tsx) -> <Provider store="{store}"> (_app.js) -> Store (Middleware, SAGA Middleware) -> SAGA Watcher перехоплює action
    // -> виклик SAGA Worker, виконує put FETCH_START (entityReducer змінює стан), асинхронний запит, виклик FETCH_SUCCESS -> (entityReducer змінює стан)
    // -> Reducer оновив стан, у tsx useSelector миттєво реагує на нове посилання в памʼяті і виконує re-render 
};

  const fetchFilteredData = async (eventId: number, category?: string) => { // фільтрація лише квитків певної події
    try {
      /*
      const res = await fetch(
        `/api/tickets?eventid=${eventId}&category=${category}`
      );*/

      /*
      let url;

      //const
      if(category){ 
        url = `tickets?eventid=${eventId}&category=${category}`;
      }
      else{
        url = `tickets?eventid=${eventId}`;
      }
      console.log("fetchFilteredData", eventId)
      //const data = await api.xRead<{getTicketList: ITicket[]}>(url);
        const data = await api.xRead <{getTicketsList: TicketResponse}>(url)
        console.log(data);
        console.log(data.getTicketsList);
        console.log(data.getTicketsList?.tickets);
        console.log(data.getTicketsList?.eventId);*/
        
      // обʼєкт певної події з відповідними відфільтрованими квитками
      /*
      if (Array.isArray(data)) {
        const grouped = data.reduce((acc: any, ticket: any) => {
          if (!acc[ticket.eventid]) {
            acc[ticket.eventid] = [];
          }
          acc[ticket.eventid].push(ticket);
          return acc;
        }, {});

        setTickets(prev => ({
          ...prev,
          [eventId]: grouped[eventId] || [] 
          // оновлення даних квитків лише для певної події, без змін для всіх інших, 
          // якщо ж у разі умови, що квитка категорії події немає - інші події залишаються для відображення
        }));
        */
        
      /*
      let url;

      //const
      if(category){ 
        url = `tickets?eventid=${eventId}&category=${category}`;
      }
      else{
        url = `tickets?eventid=${eventId}`;
      }
      console.log("fetchFilteredData", eventId)
      //const data = await api.xRead<{getTicketList: ITicket[]}>(url);
        const data = await api.xRead <{getTicketsList: TicketResponse}>(url)
        console.log(data);
        console.log(data.getTicketsList);
        console.log(data.getTicketsList?.tickets);
        console.log(data.getTicketsList?.eventId);
        console.log("fetchFilteredData KEYS", Object.keys(data));
        console.log("fetchFilteredData", data.getTicketsList.tickets)
        
        setTickets(prev => ({
          ...prev, 
          [eventId]: data.getTicketsList.tickets[eventId] || []
        }));
        console.log("Success fetch all data!")
        */
        console.log("payload: {eventId, category}")
        dispatch({type: "tickets/FETCH_REQUEST", payload: {eventid: eventId, ...(category ? {category} : {})}});
        
      //}
    } catch (error: any) {
      console.error(error.message);
    }
  };
  function Toggle(e, eventId: number) {
  const { value } = e.target;

  setEventFilters(prev => ({
    ...prev,
    [eventId]: value
  }));

  fetchFilteredData(eventId, value);
}

function ToggleGlobal(e) {
  const { value } = e.target;
  setEventsCategory(value);
  fetchAllDataWithFilter(value);
}
const fetchAllDataWithFilter = async (category: string) => { // фільтрація всіх квитків на основі параметрів для всіх подій
  try {
    //const res = await fetch(`/api/tickets?category=${category}`);
    //const data = await res.json();
    //console.log(category)
    //const url = `tickets?category=${category}`;
    //const data = await api.xRead<ITicket[]>(url);
    //const data = await api.xRead <any>(url)
    //console.log("AFTER XREAD", data);
    //console.log("KEYS", Object.keys(data));
    /*
    if (Array.isArray(data)) {
      const grouped = data.reduce((acc: any, ticket: any) => {
        if (!acc[ticket.eventid]) {
          acc[ticket.eventid] = [];
        }

        acc[ticket.eventid].push(ticket);
        return acc;
      }, {});
    */

      //setTickets(grouped); // повне оновлення даних подій на основі фільтрації їхніх квитків, де, якщо немає категорії, зникає і подія 
    /*
    console.log(category)
    const url = `tickets?category=${category}`;
    const data = await api.xRead <any>(url)
    console.log("AFTER XREAD", data);
    console.log("KEYS", Object.keys(data));
      console.log("fetchAllDataWithFilter", data.getTicketsList.tickets)
      
    setTickets(data.getTicketsList.tickets)
      //console.log("Success fetch all data!")*/
    //}
    console.log("payload: category")
    dispatch({
      type: "tickets/FETCH_REQUEST",
      payload: category ? { category } : {}
    })
  } catch (error: any) {
    console.error(error.message);
  }
};
  const ticketOptions = [
    "vip",
    "special",
    "ordinary"
  ];



  //const currentData = reduxData || [];
  //const trolling = currentData?.getTicketsList?.tickets || [];

  return (
    <Layout props = {user}>
      <div style = {{display: "flex", justifyContent: "center"}}>
        <h1>Tickets</h1>
      </div>
      {/*
      {Object.entries(tckts).length > 1 && (
      <div>
          <p>Scale</p>
            <input type = "radio" name={`category`} value = "vip" onChange={ToggleGlobal}/>vip
            <input type = "radio" name={`category`} value = "ordinary" onChange={ToggleGlobal}/>ordinary
            <input type = "radio" name={`category`} value = "special" onChange={ToggleGlobal}/>special
      </div>)
      }
      */}
      {eventId === null && (
      <Formik
        initialValues={{
          ticketType: ""
        }}
        onSubmit={(values) => {fetchAllDataWithFilter(values.ticketType)}}
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
                <div>
                  {ticketOptions.map((option) => (
                    <label
                      key={option}
                      style={{
                      display: "block",
                      marginBottom: "5px"
                    }}
                    >
                      <Field
                        type = "radio"
                        name = "ticketType"
                        value = {option}
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
            <button
            type="button"
            onClick={() => {
              resetForm();

              fetchAllData(eventId)
            }}
          >
            { eventId != null ? `Fetch` : `Reset`}
          </button>
          </>
        )}

      </Formik>
      )}
      {/*
      <div style = {{display: "flex", justifyContent: "flex-end", margin: "50px"}}>
        {eventid == null && <button onClick={() => fetchAllDataWithFilter(eventsCategory)}>Fetch</button>}
        <button onClick={() => fetchAllData(Number(eventid))}>{ eventid != null ? `Fetch` : `Reset`}</button>
      </div>*/}
      {Object.entries(tckts).length > 0 ? ( // перетворення обʼєкту tickets у масив для використання "методів масиву"
        Object.entries(tckts).map(([eventId, eventTickets]: any) => (
          
           // "розпакування" масиву на дані обʼєкта [eventId, eventTickets]
          // any дозволяє не перевіряти типи даних полів обʼєкта
          <div
            key={eventId}
            style={{
              border: "2px solid black",
              margin: "20px",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <h2>Event {eventId}</h2>
          {/*
          <div>
          <p>Scale</p>
            <input type = "radio" name={`category-${eventId}`} value = "vip" checked={eventFilters[eventId] === "vip"} onChange={(e) => Toggle(e, Number(eventId))}/>vip
            <input type = "radio" name={`category-${eventId}`} value = "ordinary" checked={eventFilters[eventId] === "ordinary"} onChange={(e) => Toggle(e, Number(eventId))}/>ordinary
            <input type = "radio" name={`category-${eventId}`} value = "special" checked={eventFilters[eventId] === "special"} onChange={(e) => Toggle(e, Number(eventId))}/>special
          </div>*/}

          <Formik
        initialValues={{
          ticketType: ""
        }}
        onSubmit={(values) => {
            setEventFilters(prev => ({
            ...prev,
            [eventId]: values.ticketType
          }));

          fetchFilteredData(eventId, values.ticketType);
        }}
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
                <div>
                  {ticketOptions.map((option) => (
                    <label
                      key={option}
                      style={{
                      display: "block",
                      marginBottom: "5px"
                    }}
                    >
                      <Field
                        type = "radio"
                        name = "ticketType"
                        value = {option}
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
            <button
            type="button"
            onClick={() => {
              resetForm();

              fetchFilteredData(eventId)
            }}
          >
            { eventId != null ? `Fetch` : `Reset`}
          </button>
          </>
        )}

      </Formik>
        
            {eventTickets.map((t: any) => (
              <div
                key={t.id}
                style={{
                  background: "#eee",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                
                {t.priceperticket} {t.statusticket} {t.category}
              </div>
            ))}
          </div>
        ))
      ) : ( // якщо довжина масиву менше 1, то квитки розпродані
        <div>Sold out!</div>
      )}

      {Object.entries(ticketsRedux).length > 0 ? ( // перетворення обʼєкту tickets у масив для використання "методів масиву"
        Object.entries(ticketsRedux).map(([eventId, eventTickets]: any) => (
          
           // "розпакування" масиву на дані обʼєкта [eventId, eventTickets]
          // any дозволяє не перевіряти типи даних полів обʼєкта
          <div
            key={eventId}
            style={{
              border: "2px solid black",
              margin: "20px",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <h2>Event {eventId}</h2>
          {/*
          <div>
          <p>Scale</p>
            <input type = "radio" name={`category-${eventId}`} value = "vip" checked={eventFilters[eventId] === "vip"} onChange={(e) => Toggle(e, Number(eventId))}/>vip
            <input type = "radio" name={`category-${eventId}`} value = "ordinary" checked={eventFilters[eventId] === "ordinary"} onChange={(e) => Toggle(e, Number(eventId))}/>ordinary
            <input type = "radio" name={`category-${eventId}`} value = "special" checked={eventFilters[eventId] === "special"} onChange={(e) => Toggle(e, Number(eventId))}/>special
          </div>*/}

          <Formik
        initialValues={{
          ticketType: ""
        }}
        onSubmit={(values) => {
            setEventFilters(prev => ({
            ...prev,
            [eventId]: values.ticketType
          }));

          fetchFilteredData(eventId, values.ticketType);
        }}
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
                <div>
                  {ticketOptions.map((option) => (
                    <label
                      key={option}
                      style={{
                      display: "block",
                      marginBottom: "5px"
                    }}
                    >
                      <Field
                        type = "radio"
                        name = "ticketType"
                        value = {option}
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
            <button
            type="button"
            onClick={() => {
              resetForm();

              fetchFilteredData(eventId)
            }}
          >
            { eventId != null ? `Fetch` : `Reset`}
          </button>
          </>
        )}

      </Formik>
        
            {eventTickets.map((t: any) => (
              <div
                key={t.id}
                style={{
                  background: "#eee",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                
                {t.priceperticket} {t.statusticket} {t.category}
              </div>
            ))}
          </div>
        ))
      ) : ( // якщо довжина масиву менше 1, то квитки розпродані
        <div>Sold out!</div>
      )}
    </Layout>
  );
}