/*import Layout from "../components/layout";
import sequelize from "../lib/sequelize";
import { OrderModel } from "../Server/Models/Order";

export async function getServerSideProps() {
  const Order = OrderModel({ db: sequelize });
  // підключення до БД (sequelize) -> створення моделі та її повернення

  const orders = await Order.findAll({ raw: true });

  return {
    props: { orders },
  };
}

export default function DealsPage({ orders }) {
  return (
    <Layout>
      <h1>Deals</h1>

      {orders.map((d: any) => (
        <div key={d.id}>
          {d.id} - {d.statusorder}
        </div>
      ))}
    </Layout>
  );
}*/