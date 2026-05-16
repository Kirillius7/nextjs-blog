// components/Layout.tsx
import Link from "next/link";
import Styles from './layout.module.css';
export default function Layout({ children }) {
  return (
    <div className={Styles.navBar}>
      <nav style={{display: "flex", height: "150px", justifyContent: "space-between", padding: "40px",alignItems: "center", position: "sticky", top: 0, zIndex: 100, background: "rgba(229, 218, 118, 1)" }}>
        <div style={{display: "flex", justifyContent: "flex-start"}}>
          <Link href="/home">Eventra</Link>
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
        </div>


      </nav>
      <main>{children}</main>
    </div>
  );
}