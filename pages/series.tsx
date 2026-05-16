import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
//import sequelize from "../lib/sequelize";
//import { Event_SerieModel } from "../Server/Models/Event_Series";
import { Field, Form, Formik } from "formik";
import { api } from "../lib/api";
import { IEvent_Serie } from "../Server/Models/Event_Series";
import { models } from "../Server/Models/index";

export async function getServerSideProps() {
  //const Event_Serie = Event_SerieModel({ db: sequelize });
  const {EventSeries} = models
  const event_series = await EventSeries.findAll({ raw: true });

  return {
    props: { event_series },
  };
}

export default function Event_SeriesPage({ event_series }) {
  const[e_series, setE_series] = useState(event_series);
  const[filters, setFilters] = useState({audienceType: "", venueType: "", scale: ""})
  
  useEffect(() => {
    console.log("PAGE MOUNTED");
  }, []);
  const fetchAllData = async () => {
    try {
      /*const res = await fetch(`/api/event_series`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setE_series(data);
        console.log("Success fetch all data!")
      }*/
      const data = await api.xRead<IEvent_Serie[]>("event_series");
      setE_series(data);
      console.log("Success fetch all data!")
    } catch (error) {
      console.error("Помилка отримання всіх даних:", error);
    }
  };

  const fetchFilteredData = async (currentFilters) => {
    try {
      const cleanFilters = Object.fromEntries(// перетворення обʼєкта у масив
        Object.entries(currentFilters).filter(([_, v]) => v) // видалення зайвих пустих значень й повернення у обʼєкт
      ) as Record<string, string>; // запобігання відправлення пустих фільтрів до API 

      const query = new URLSearchParams(cleanFilters).toString();
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
      const url = query ? `event_series?${query}` : `event_series`;
      const data = await api.xRead<IEvent_Serie[]>(url);
      setE_series(data);
      console.log("Success filter!")
    } catch (error) {
      console.error("Помилка фільтрації:", error);
    }
  };

  function Toggle(e) {
    const { name, value } = e.target;

    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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
    <Layout>
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

       <div style = {{display: "flex",  alignItems: "center",  flexDirection: "column", justifyContent: "center"}}>
      {e_series.map((e: any) => (
    <div style={{
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
        }} key={e.id}>
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