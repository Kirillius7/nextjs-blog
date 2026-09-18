import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { useRouter } from "next/router";
import Layout from "../components/layout";

export default function Error(){
    const router = useRouter();

    const httpCode = typeof router.query.code == "string" ? Number(router.query.code) : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = router.query.message;
    /*
    const httpCodes = [
        StatusCodes.BAD_REQUEST, StatusCodes.UNAUTHORIZED, StatusCodes.INTERNAL_SERVER_ERROR
    ];
    const validCode = Object.values(httpCodes).includes(httpCode);

    const code = validCode ? httpCode : StatusCodes.INTERNAL_SERVER_ERROR;
    */ //code
    return(
        <Layout>
            <div style = {{display: "flex", flexDirection: "column", height: "70vh", alignItems: "center", justifyContent: "center"}}>
                <h1 style = {{margin: 0, fontSize: "48px"}}>-- {httpCode} --</h1>               
                <p style = {{margin: 0, fontSize: "22px"}}> {getReasonPhrase(httpCode)}</p>
                <p>{message}</p>              
            </div>
        </Layout>
    )
}