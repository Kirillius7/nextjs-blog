import Layout from "../components/layout";
function Error404(){
    return(
        <Layout>       
        <div style = {{display: "flex", flexDirection: "column", height: "70vh", gap: "10px", justifyContent: "center", alignItems: "center"}}>
            <h1 style={{ fontSize: "48px", margin: 0 }}> -- 404 --</h1>
            <p>Oops... {"It seems this page doesn't exist"}
            </p>
        </div>
        </Layout>     
    )
}

export default Error404;