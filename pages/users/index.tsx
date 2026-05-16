import Layout from "../../components/layout";
//import sequelize from "../lib/sequelize";
import { IUser } from "Server/Models/User";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { models } from "../../Server/Models/index";
import { api } from "../../lib/api";
export async function getServerSideProps() {
  const {User, Order, Ticket, Event} = models;

  const users = await User.findAll({
    where: {role: "client"},
    include:[{
      model: Order,
      as: "orders",
      include:[{
        model: Ticket,
        as: "tickets",
        include:[{
          model: Event,
          as: "eventTicket",
          attributes: ["eventName"],
        }]
      }],
      attributes: ["id", "userid"],
      //through: { attributes: [] },
      required: false, // виведення всіх подій, навіть якщо деякі з них не мають серій
    }],
  });
    //raw: true });

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)) // JSON рядок -> JSON обʼєкт
    }
  };
}

export default function UsersPage({ users }) {
  const[usrs, setUsers] = useState(users);
  
  const fetchAllData = async() => {
    const url = "users";

    const data = await api.xRead<IUser[]>(url);
    setUsers(data);
  }

  const fetchFilteredData = async(eventName: string, categoryTicket: string) => {
      //const query = eventName ? (new URLSearchParams({ stageName: eventName }).toString()) : "";

      /*let url;
      if(eventName)
        url = `users?eventName=${eventName}`;
      else
        url = 'users';
      url = categoryTicket ? 
      const data = await api.xRead<IUser[]>(url);
      setUsers(data);*/

      const params = new URLSearchParams();
      if (eventName.trim()) {
        params.append("eventName", eventName);
      }

      if (categoryTicket.trim()) {
        params.append("categoryTicket", categoryTicket);
      }

      const query = params.toString();

      const url = query
        ? `users?${query}`
        : "users";

      console.log(url);

      const data = await api.xRead(url);

      setUsers(data);
  }

  const ticketOptions = [
    "vip",
    "special",
    "ordinary"
  ];

  return (
    <Layout>
      <h1>Our clients</h1>
      <div>
      <Formik
  initialValues={{ nameEvent: "", categoryTicket: "" }}
  validate={(values) => {
    const errors: any = {};

    if (!values.nameEvent.trim() && !values.categoryTicket) {
      errors.nameEvent = "Enter event or choose category!";
    }

    return errors;
  }}
  onSubmit={async (values, { setSubmitting }) => {
    await fetchFilteredData(values.nameEvent, values.categoryTicket);
    setSubmitting(false);
  }}
>
  {({ resetForm, errors, touched, isSubmitting, values }) => (
    <>
      <Form>
        {errors.nameEvent && touched.nameEvent && (
          <div style={{ color: "red", fontSize: "10px" }}>
            {errors.nameEvent}
          </div>
        )}

        <Field
          name="nameEvent"
          placeholder="input your event name"
        />

        <div>
          {ticketOptions.map((option) => (
            <label key={option}>
              <Field type="radio" name="categoryTicket" value={option} />
              {option}
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            (!values.nameEvent.trim() && !values.categoryTicket)
          }
        >
          {isSubmitting ? "Loading..." : "Apply filters"}
        </button>
      </Form>

      <button
        onClick={() => {
          resetForm();
          fetchAllData();
        }}
      >
        Reset
      </button>
    </>
  )}
</Formik>
      </div>
      <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    marginTop: "20px",
  }}
>
  {usrs.map((u: any) => (
    <div
      key={u.id}
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #dcdcdc",
        borderRadius: "16px",
        width: "500px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          marginBottom: "15px",
          borderBottom: "1px solid #ececec",
          paddingBottom: "10px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
          }}
        >
          {u.username}
        </h2>

        <p
          style={{
            margin: "5px 0 0 0",
            color: "gray",
          }}
        >
          User ID: {u.id} | Role: {u.role}
        </p>
      </div>

      {u.orders.map((o: any) => (
        <div
          key={o.id}
          style={{
            backgroundColor: "#f8f8f8",
            borderRadius: "12px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "10px",
            }}
          >
            Order #{o.id}
          </h3>

          {o.tickets.map((t: any) => (
            <div
              key={t.id}
              style={{
                backgroundColor: "white",
                border: "1px solid #e5e5e5",
                borderRadius: "10px",
                padding: "12px",
                marginBottom: "10px",
              }}
            >
              <p><strong>Ticket ID:</strong> {t.id}</p>
              <p><strong>Status:</strong> {t.statusticket}</p>
              <p><strong>Price:</strong> ${t.priceperticket}</p>
              <p><strong>Event:</strong> {t.eventTicket.eventName}</p>
              <p><strong>Category:</strong> {t.category}</p>
            </div>
          ))}
          <Link href = {`/orders/${o.id}`}>
            <button>Go to order</button>
          </Link>
        </div>
      ))}
      
    </div>
  ))}
</div>
    </Layout>
  );
}
