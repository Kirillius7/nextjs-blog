import { useEffect, useState } from "react";
import Layout from "../components/layout";
//import sequelize from "../lib/sequelize";
//import { initAssociations } from '../Server/Models/associations';
//import { models } from "../Server/Models/index";
//
//import container from "../Server/DI/container";
//import IContextContainer from "../Server/DI/Interfaces/IContextContainer";
//import { sequelizeModels } from "../Server/Models/createModels";
import { Field, Form, Formik } from "formik";
//import { sequelizeModels } from "Server/Models/createModels";
import { IArtist } from "@/Server/Models/Artist";
import Store from "@/Server/Store/Store";
//import { api } from "../lib/api";
import { AppState } from "@/Server/Store/ReduxStore";
import { useDispatch, useSelector } from "react-redux";
//import container from "../lib/container";


/*
export async function getServerSideProps() { 
  // функція, що виконується тільки на сервері, при кожному request 

  // створюється DI container, реєструються models, реєструються services
  // реєструються controllers, створюються associations, export default container
  // import container from "../Server/DI/container"; може бути небезпечним у Next.js.
  // аналізує imports, будує dependency graph, може затягнути server-only modules у bundle analysis
  const containerModule = await import("Server/DI/container");
  const container = containerModule.default;

  // cradle не містить готові object-и напряму. cradle це interface доступу до dependencies
  // Він: ліниво створює dependencies inject-ить dependencies кешує singleton-и

  // container — це runtime object Awilix. 
  // (реєструє залежності, створює залежності, кешує singleton-и, inject dependencies)

  // IContextContainer - карта того, що є всередині container
  const cradle: IContextContainer = container.cradle;

  // Діагностика в консолі сервера (у браузері її тепер не буде)
  console.log("=== КОНТЕЙНЕР УСПІШНО ІЗОЛЬОВАНО НА СЕРВЕРІ ===");
  console.log(Object.keys(container.cradle));

  //const { Event, Artist } = container.cradle as any;
  const { Event, Artist } = cradle;

  const events = await Event.findAll({
    where: {status_event: "active"},
    order: [["id", "ASC"]],
    // процес залучення артистів разом із подіями (яка таблиця, яке імʼя поля, додані поля)
    include: [
      {
        model: Artist,
        as: "Performers", // звʼязок між таблицями, на цій основі додана можливість доступу до полів підтаблиці (артисти)
        attributes: ["id", "stage_name"],
        through: { attributes: [] }, // видалення даних з проміжної таблиці
      },

    ],
  });
  // спеціальні обʼєкти (instances), вони містять прототипи, методи, внутрішні поля, складні вкладені обʼєкти
  // оскільки був використаний include і це без "raw: true" (який повертає JS-обʼєкти)
  return {
    props: {
      events: JSON.parse(JSON.stringify(events)), // JSON рядок -> JSON обʼєкт
    },
  };
}
*/

type ArtistResponse = {
  artists: IArtist[]
}
/*
export const getServerSideProps = Store.getServerSideProps(
  "artistController",
)*/

export const getServerSideProps = Store.getServerSideProps(
  [
    {
      controller: "artistController",
      redux: "artists"
    }
  ]
)

export default function ArtistsPage({ data }) {
  const dispatch = useDispatch();
  const reduxData = useSelector((state: AppState) => state.entities.artists);
  console.log("reduxData", reduxData);

  const[nameArtist, setNameArtist] = useState("");

  /*
  console.log("data",data);
  console.log("data.getArtistList",data.getArtistList);
  console.log("data.getArtistList.artists",data.getArtistList.artists);
  */
  const[user] = useState(data.identity);

  //const[artists, setArtists] = useState(data.getArtistList.artists);
  const artists = reduxData?.data?.getArtistList.artists || [];
  const fetchAllData = async () => {
    //try{

      /*const res = await fetch(`/api/artists`)
      const data = await res.json();
      if(Array.isArray(data))
      {
        setArtists(data);
        setNameArtist(""); 
      }*/

      //const data = await api.xRead<IArtist[]>("artists");

      /*
      const data = await api.xRead<{getArtistList: ArtistResponse}>("artists");
      setArtists(data.getArtistList.artists);
      setNameArtist("");
    }
    catch(error){
      console.log(error.message);
    }*/

    dispatch(
      { type: "artists/FETCH_REQUEST", payload: {}}
    )
    
    
  }
  const fetchFilteredData = async (nameArtist: string) => {
    // -> try{
      // створення query для запиту (URL) на основі того, що було введено користувачем
      // -> const query = nameArtist ? (new URLSearchParams({ stageName: nameArtist }).toString()) : "";
      /*const url = query ? `/api/artists?${query}` : `/api/artists`;

      const res = await fetch(url);
      const data = await res.json();

      if(Array.isArray(data)){ // оскільки в api запит завжди findAll (а він повертає масив), то і цей приклад повертає масив
        setArtists(data); // з подальшим асигнуванням до змінної стану та її оновленням
        console.error("New Data - fetchFilteredData");
      }*/
      
      /*  const url = query ? `artists?${query}` : `artists`;
      const data = await api.xRead<{getArtistList: ArtistResponse}>(url);
      setArtists(data.getArtistList.artists);
    }
    catch(error){
      console.error("Filter error:", error);
    }*/

    const payload = nameArtist ? { stageName: nameArtist} : {};

    dispatch({type: "artists/FETCH_REQUEST", payload})
    
  }
  
    useEffect(() => {
      console.log("PAGE MOUNTED");
    }, []);

  
  return (
    <Layout props = {user}>
      <div style = {{display: "flex", justifyContent: "center"}}>
        <h1>Events & Performers</h1>
        <h2>{user.id}</h2>
        <p>{nameArtist}</p>
      </div>
      <div>
       {/* <form onSubmit={(e) => {
          e.preventDefault();
          fetchFilteredData(nameArtist)}}>
          <input
          type="text"
          placeholder="input your artist name"
          name = "artistName"
          value = {nameArtist}
          onChange = {(e) => setNameArtist(e.target.value)}
          />
          <button type = "submit">Submit</button>
        </form>*/}
       <Formik
          initialValues={{ nameArtist: "" }}
          validate={(values) => {
            const errors: { nameArtist?: string } = {};
            if (!values.nameArtist.trim()) {
              errors.nameArtist = "Artist name is required!";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            await fetchFilteredData(values.nameArtist);
            setSubmitting(false);
          }}
        >
          {({ resetForm, errors, touched, isSubmitting, values, setTouched }) => (
            <>
              <Form>
                {/* Помилка показується лише якщо поле touched та є текст помилки */}
                {errors.nameArtist && touched.nameArtist && (
                  <div style={{ color: "red", marginTop: "5px", fontSize: "10px" }}>
                    {errors.nameArtist}
                  </div>
                )}

                <Field
                  type="text"
                  name="nameArtist"
                  placeholder="input your artist name"
                  style={{
                    border: errors.nameArtist && touched.nameArtist
                      ? "2px solid red"
                      : "1px solid gray",
                  }}
                />
                
                <button 
                  type="submit" 
                  disabled={isSubmitting || !values.nameArtist.trim()}
                >
                  {isSubmitting ? "Loading..." : "Submit"}
                </button>
              </Form>

              <button
                onClick={() => {
                  resetForm(); // Очищує значення
                  fetchAllData();
                  // Якщо ви хочете, щоб після Reset поле вважалося "перевіреним" 
                  // і підсвітилося червоним (бо воно порожнє):
                  setTouched({ nameArtist: true }); 
                }}
              >
                Reset
              </button>
                            <button
                onClick={() => {
                  fetchAllData();
                }}
              >
                TestReset
              </button>
            </>
          )}
        </Formik>
        {/*<button onClick={fetchAllData}>Reset</button>*/}
      </div>
      
      {artists.map((event: any) => ( // головний масив, що містить дані як про подію, так і про виконавців
        <div
          key={event.id}
          style={{
            border: "2px solid black",
            margin: "20px",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <h2>{event.id} {event.eventName}</h2> 
          
          {event.Performers.length > 0 ? (
            <div>
              {event.Performers.map((p: any) => ( // виведення даних про виконавців
                <div
                  key={p.id}
                  style={{
                    background: "#eee",
                    margin: "10px",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  🎤 {p.stage_name}
                </div>
              ))}
            </div>
          ) : (
            <p>No performers</p>
          )}
        </div>
      ))}
    </Layout>
  );
}