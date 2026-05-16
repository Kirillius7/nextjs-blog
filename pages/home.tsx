import Image from "next/image";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
  <div style={{ 
    backgroundColor: "#ead269ff",
    minHeight: "100vh", 
    position: "relative" 
  }}>

    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Image
        src="/Coachella.jpg"
        alt="Coachella"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div style={{
        position: "absolute",
        lineHeight: 0.1,
        top: "20%", 
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%", 
        textAlign: "center", 
        fontSize: "40px", 
        color: "white",  
        fontWeight: "bold",
        
        textShadow: "2px 2px 10px rgba(0,0,0,0.5)" 
      }}>
        <p>2027 Advance Sale</p>
          <p>Passes On Sale</p>
          <p>Friday, May 1 at 11am PT</p>
      </div>
    </div>

    <div style={{ 
      position: "relative", 
      padding: "40px", 
      color: "white",
      maxWidth: "1200px",
      margin: "0 auto" 
    }}>
      <h2>More Information</h2>
      <p>This content is sitting on the background color, below the image.</p>
      <h2>More Information</h2>
      <p>This content is sitting on the background color, below the image.</p>
      <h2>More Information</h2>
      <p>This content is sitting on the background color, below the image.</p>
      <h2>More Information</h2>
      <p>This content is sitting on the background color, below the image.</p>
      <h2>More Information</h2>
      <p>This content is sitting on the background color, below the image.</p>
      <h2>More Information</h2>
      <p>This content is sitting on the background color, below the image.</p>
    </div>
    <section style={{ 
      display: "flex", 
      justifyContent: "space-around", 
      padding: "60px 20px", 
      backgroundColor: "#000" 
    }}>
      <div style={{ flex: 1, borderRadius: "15px", margin: "20px", textAlign: "center", color: "white", background: "green"}}>
        <h4>Secure Tickets</h4>
        <p>Verified resale and primary sales.</p>
        <p>Verified resale and primary sales.</p>
        <p>Verified resale and primary sales.</p>
      </div>
      <div style={{ flex: 1, borderRadius: "15px", margin: "20px", textAlign: "center", color: "white", background: "green" }}>
        <h4>Exclusive Access</h4>
        <p>Backstage passes and VIP lounges.</p>
        <p>Backstage passes and VIP lounges.</p>
        <p>Backstage passes and VIP lounges.</p>
      </div>
      <div style={{ flex: 1, borderRadius: "15px", margin: "20px", textAlign: "center", color: "white", background: "green" }}>
        <h4>Experience</h4>
        <p>Art installations and world-class food.</p>
        <p>Art installations and world-class food.</p>
        <p>Art installations and world-class food.</p>
      </div>
    </section>

  </div>  
  <footer style = {{display: "flex", background: "gray", color: "white", justifyContent: "space-around", alignItems: "center"}}>
    <p>asdads</p>
    <p>asdads</p>
    <p>asdads</p>
    <p>asdads</p>
    <p>asdads</p>
    <p>asdads</p>
    <p>asdads</p>
  </footer>
</Layout>
  );
}