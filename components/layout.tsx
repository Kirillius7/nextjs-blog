// components/Layout.tsx
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { api } from "../lib/api";
import Styles from './layout.module.css';

export default function Layout({ children, props } : {children: React.ReactNode, props?: any}) {
  const router = useRouter();
  const logOut = async() => {
    console.log("asd")
    
    try{
      //const result = await api.xSave("logout");
      await api.xSave("logout");
      //if(result)
      //{

        //router.push('/')  
      toast.success("Success!", {
          autoClose: 3000, // сам зникне через 1.5 секунди
          onClose: () => {
            // Цей код виконається І коли час вийде, І коли користувач натисне хрестик!
            window.location.href = "/";
          }
        });
      //}
    }
    catch(err: any){
      console.warn("Logout request failed, cleaning local state anyway", err);
    }
    /*
    finally{
      window.location.href = "/"
    }*/

    /*
    try {
      const result = await api.xSave("logout");
      if (result) {
        // Передаємо функцію редиректу прямо в налаштування тоста
        toast.success("Success!", {
          onClose: () => {
            window.location.href = "/";
          },
          autoClose: 1500 // тост закриється через 1.5 сек і спрацює onClose
        });
      }
    } catch (err: any) {
      console.warn("Logout request failed", err);
      window.location.href = "/";
    }*/
  }
  return (
    <div className={Styles.navBar}>
      <nav style={{display: "flex", height: "150px", justifyContent: "space-between", padding: "40px",alignItems: "center", position: "sticky", top: 0, zIndex: 100, background: "rgba(229, 218, 118, 1)" }}>
        <div style={{display: "flex", justifyContent: "flex-start"}}>
          <Link href="/">Eventra</Link>
        </div>
        <div style={{display: "flex", gap: "20px" }}>
          <Link href="/events">Events</Link>
          <Link href="/series">Series</Link>
          <Link href="/artists">Featured artists</Link>
          <Link href="/tickets">Tickets</Link>
          <div className={Styles.dropdown}>
            <Link href="/experience" className={Styles.dropdownLabel}>
              Experience <span className={Styles.arrowDown}></span>
            </Link>
            
            <div className={Styles.dropdownContent}>
              <Link href="/events" className={Styles.arf}>
                <span>Info guide</span>
                <span>Fingers are placking</span>
              </Link>
              <Link href="/artists" className={Styles.arf}>
                <span>Info guide &rarr;</span>
                <span>Fingers are placking</span>
              </Link>
              <Link href="/tickets" className={Styles.arf}>
                <span>Tickets</span>
                <span>Booking now</span>
              </Link>             
            </div>
          </div>
          <Link href="/users">Users</Link>
          <Link href="/orders">Orders</Link>
          {props && (<div className={Styles.dropdown}>
              <span>{props.username}</span>
              <div className={Styles.dropdownContent1}>
                  <button type="submit" onClick={logOut}>Log out</button>
              </div>

          </div>)}
          {!props && (
            <Link href = "/login">
              Login
            </Link>
          )}
        </div>


      </nav>
      <main>{children}</main>
    </div>
  );
}