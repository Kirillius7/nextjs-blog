import Layout from "components/layout";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";

import { IOrder } from "@/Server/Models/Order";
import Store from "@/Server/Store/Store";
import { api } from "../../lib/api";
/*
export async function getServerSideProps(context) {
    const {orderid} = context.query;
      await import("Server/Models/createModels"); 
  
  // Тепер імпортуємо контейнер (теж динамічно або звичайним імпортом зверху, 
  // але динамічно всередині функції надійніше, щоб уникнути каші в бандлі)
  const containerModule = await import("Server/DI/container");
  const container = containerModule.default;
  const cradle: IContextContainer = container.cradle;
  
    const {Order, Event, Ticket} = cradle;

    const orders = await Order.findAll({
        where: {id: orderid},
        include:[{
            model: Ticket,
            as: "tickets",
            include:[{
                model: Event,
                as: "eventTicket",
                attributes: ["eventName"],
            }]
        }]
        //raw:true
    })

    return{
        props:{
            orders: JSON.parse(JSON.stringify(orders))
        }
    }
}
*/

export const getServerSideProps = Store.getServerSideProps(
    "orderController"
)
  const ticketOptions = [
    "vip",
    "special",
    "ordinary"
  ];
type OrderResponse = {
  orders: IOrder[],
  orderid: number | null
}
export default function OrdersPage({data}){
      /*
      const router = useRouter();
      
      const orderid =
        typeof router.query.orderid === "string"
        ? router.query.orderid
        : undefined;
      */
    const[user] = useState(data.identity);
    const[ordrs, setOrders] = useState(data.getOrdersList.orders);

    const orderid = data.getOrdersList.orderid;

    const fetchAllData = async(orderid?: string) =>{
        console.log(orderid);
        const url = orderid ? `orders?orderid=${orderid}` : "orders";
        console.log(url);
        const data = await api.xRead<{getOrdersList: OrderResponse}>(url);

        setOrders(data.getOrdersList.orders);
    }

    const fetchFilteredData = async(eventName: string, categoryTicket: string, orderid?: string) =>{
        const params = new URLSearchParams();

        if(eventName.trim())
            params.append("eventName", eventName)

        if(categoryTicket.trim())
            params.append("categoryTicket", categoryTicket)

        if(orderid !== undefined && orderid !== null)
            params.append("orderid", orderid)

        const query = params.toString();

        const url = query ? `orders?${query}` : "orders";
        console.log(url);
        const data = await api.xRead<{getOrdersList: OrderResponse}>(url);

        setOrders(data.getOrdersList.orders);
    }

    return(
        <Layout props = {user}>
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
                await fetchFilteredData(values.nameEvent, values.categoryTicket, orderid);
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
                      fetchAllData(orderid);
                    }}
                  >
                    Reset
                  </button>
                </>
              )}
            </Formik>
            <div style = {{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {ordrs.map((order) => (
                    <div key = {order.id} style = {{backgroundColor: "rgba(204, 210, 215, 1)", 
                            border: "1px solid rgba(131, 185, 239, 1)",
                            borderRadius: "15px",
                            width: "500px",
                            padding: "20px"}}>
                        <div style = {{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <p style={{ margin: "2px 0" }}>OrderID: {order.id}</p>
                            <p style={{ margin: "2px 0" }}>Status: {order.statusorder}</p>
                        </div>
                        {/*<p>publishedAt: {new Date(order.publishedAt * 1000).toLocaleDateString()}</p>*/}
                        {order.tickets.map((tckt) => (
                          <div key = {tckt.id}>
                            <div style = {{backgroundColor: "white",
                border: "1px solid #e5e5e5",
                borderRadius: "10px",
                padding: "12px",
                marginBottom: "10px"}}>
                            <p>OrderId: {tckt.orderid}</p>
                            <p>UserId: {tckt.userid}</p>
                            <p>PricePerTicket: {tckt.priceperticket}</p>
                            <p>Category: {tckt.category}</p>
                            <p>NameEvent: {tckt.eventTicket.eventName}</p>
                            
                            </div>
                        </div>))}
                        <Link href = {`/users/${order.userid}`}>
                                <button>Go to user</button>
                        </Link>
                    </div>
                ))}
            </div>
            
        </Layout>
    )
}
