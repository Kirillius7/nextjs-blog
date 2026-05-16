import { useState } from "react";
import Layout from "../components/layout";
//import sequelize from "../lib/sequelize";
//import { TicketModel } from "../Server/Models/Ticket";
import { ITicket } from "Server/Models/Ticket";
import { Field, Form, Formik } from "formik";
import { models } from "../Server/Models/index";
import { api } from "../lib/api";
export async function getServerSideProps(context) {
  const { eventid } = context.query;
  
  //const Ticket = TicketModel({ db: sequelize });
  const {Ticket} = models;
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

export default function TicketsPage({ tickets, eventid }) { // next.js самостійно викликає getServerSideProps та виводить props
  const[tckts, setTickets] = useState(tickets);
  const [eventFilters, setEventFilters] = useState<{[eventId: number]: string;}>({});
  const [eventsCategory, setEventsCategory] = useState(""); 
  // збереження для кожної події власного фільтра, оскільки у квитків лише 1 фільтр (категорія), то цього вистачить для роботи
  const fetchAllData = async(eventid?: number) =>{
  try {
   /* const url =
      eventid != null
        ? `/api/tickets?eventid=${eventid}`
        : `/api/tickets`;

    const res = await fetch(url);
    const data = await res.json();
    */
      const url = eventid != 0 ? `tickets?eventid=${eventid}` : `tickets`;
      const data = await api.xRead<ITicket[]>(url);
      if (Array.isArray(data)) {
        const grouped = data.reduce((acc: any, ticket: any) => {
          if (!acc[ticket.eventid]) {
            acc[ticket.eventid] = [];
          }

          acc[ticket.eventid].push(ticket);
          return acc;
        }, {});

        setTickets(grouped);
        setEventsCategory("");
        console.log("Success fetch all data!")
      }
    }
    catch(error){
      console.error({error: error.message})
    }
  }

  const fetchFilteredData = async (eventId: number, category?: string) => { // фільтрація лише квитків певної події
    try {
      /*
      const res = await fetch(
        `/api/tickets?eventid=${eventId}&category=${category}`
      );*/
      let url;

      //const
      if(category){ 
        url = `tickets?eventid=${eventId}&category=${category}`;
      }
      else{
        url = `tickets?eventid=${eventId}`;
      }
      const data = await api.xRead<ITicket[]>(url);
      // обʼєкт певної події з відповідними відфільтрованими квитками
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
        console.log("Success fetch all data!")
      }
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

    const url = `tickets?category=${category}`;
    const data = await api.xRead<ITicket[]>(url);

    if (Array.isArray(data)) {
      const grouped = data.reduce((acc: any, ticket: any) => {
        if (!acc[ticket.eventid]) {
          acc[ticket.eventid] = [];
        }

        acc[ticket.eventid].push(ticket);
        return acc;
      }, {});

      setTickets(grouped); // повне оновлення даних подій на основі фільтрації їхніх квитків, де, якщо немає категорії, зникає і подія 
      console.log("Success fetch all data!")
    }
  } catch (error: any) {
    console.error(error.message);
  }
};
  const ticketOptions = [
    "vip",
    "special",
    "ordinary"
  ];
  return (
    <Layout>
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

              fetchAllData(Number(eventid))
            }}
          >
            { eventid != null ? `Fetch` : `Reset`}
          </button>
          </>
        )}

      </Formik>
      {/*
      <div style = {{display: "flex", justifyContent: "flex-end", margin: "50px"}}>
        {eventid == null && <button onClick={() => fetchAllDataWithFilter(eventsCategory)}>Fetch</button>}
        <button onClick={() => fetchAllData(Number(eventid))}>{ eventid != null ? `Fetch` : `Reset`}</button>
      </div>*/}
      {Object.entries(tckts).length > 0 ? ( // перетворення обʼєкту tickets у масив для використання "методів масиву"
        Object.entries(tckts).map(([eventId, eventTickets]: any) => ( // "розпакування" масиву на дані обʼєкта [eventId, eventTickets]
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
            { eventid != null ? `Fetch` : `Reset`}
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