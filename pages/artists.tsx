import { useEffect, useState } from "react";
import Layout from "../components/layout";
//import sequelize from "../lib/sequelize";
//import { initAssociations } from '../Server/Models/associations';
import { models } from "../Server/Models/index";
//
import { Field, Form, Formik } from "formik";
import { IArtist } from "Server/Models/Artist";
import { api } from "../lib/api";
export async function getServerSideProps() {
  //const { Event, Artist } = initAssociations(sequelize);
  const { Event, Artist } = models;
  

  // запит на виведення списку подій, де статус "активний"
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

export default function ArtistsPage({ events }: any) {
  const[nameArtist, setNameArtist] = useState("");
  const[artists, setArtists] = useState(events);

  const fetchAllData = async () => {
    try{
      /*const res = await fetch(`/api/artists`)
      const data = await res.json();
      if(Array.isArray(data))
      {
        setArtists(data);
        setNameArtist(""); 
      }*/

      const data = await api.xRead<IArtist[]>("artists");
      setArtists(data);
      setNameArtist("");
    }
    catch(error){
      console.log(error.message);
    }
  }
  const fetchFilteredData = async (nameArtist) => {
    try{
      // створення query для запиту (URL) на основі того, що було введено користувачем
      const query = nameArtist ? (new URLSearchParams({ stageName: nameArtist }).toString()) : "";
      /*const url = query ? `/api/artists?${query}` : `/api/artists`;

      const res = await fetch(url);
      const data = await res.json();

      if(Array.isArray(data)){ // оскільки в api запит завжди findAll (а він повертає масив), то і цей приклад повертає масив
        setArtists(data); // з подальшим асигнуванням до змінної стану та її оновленням
        console.error("New Data - fetchFilteredData");
      }*/
      const url = query ? `artists?${query}` : `artists`;
      const data = await api.xRead<IArtist[]>(url);
      setArtists(data);
    }
    catch(error){
      console.error("Filter error:", error);
    }
  }
  
    useEffect(() => {
      console.log("PAGE MOUNTED");
    }, []);

  
  return (
    <Layout>
      <div style = {{display: "flex", justifyContent: "center"}}>
        <h1>Events & Performers</h1>
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