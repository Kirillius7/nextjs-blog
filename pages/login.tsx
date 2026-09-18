import Store from "@/Server/Store/Store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/layout";
import { api } from "../lib/api";

export const getServerSideProps = Store.getServerSideProps("authController");

export default function loginPage({data}){

    const[user] = useState(data.identity)
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    //const [error, setError] = useState(""); // Стан для відображення помилок користувачу
    //const [loading, setLoading] = useState(false);

    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) =>{
        const {name, value} = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }))

        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    }
    /*
    const handleLoginSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        //setError("");
        //setLoading(true);

        try {
            // запит в папку api до файлу login.js
            const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // метадані для парсингу рядку в обʼєкт
            },
            body: JSON.stringify({ email, password }), // передача обʼєкту в текстовий рядок у форматі json
            credentials: "include" // збереження у браузері кукі, "прикріплення" кукі до кожного запиту на сервер
            });

        const data = await response.json();

        if (!response.ok) {
            // Якщо сервер повернув помилку (наприклад, статус 401 або 500)
            throw new Error(data.message || "Неправильний email або password");
        }

        console.log("Успішний вхід! Дані користувача:", data);
            
            // редіркет користувача на головну сторінку або в кабінет
            router.push("/");
            
        } 
        catch (err: any) {
            //setError(err.message || "Сталася помилка при спробі увійти");
        } 
        finally {
            //setLoading(false);
        }

    }
    */
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleLoginSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        //setError("");
        //setLoading(true);

        try {
            await api.xSave("login", form);
            router.push('/')
            toast.success("Success!");
            //window.location.href = "/"


            
        } 
        catch (err: any) {
            const details = err?.details;
            if(Array.isArray(details)){
                const errorsMap: Record<string, string> = {};

                details.forEach((errorItem: any) => {
                    const fieldName = errorItem.instancePath ? errorItem.instancePath.replace(/^\//, "") :
                        errorItem.params?.missingProperty;
                    
                    if(fieldName){
                        errorsMap[fieldName] = errorItem.message;
                    }
                })
                setFieldErrors(errorsMap);
                
            }
            //setError(err.message || "Сталася помилка при спробі увійти");
        } 
        finally {
            //setLoading(false);
        }

    }


    /*
    return(
        <Layout>
            <div>
                <form onSubmit={handleLoginSubmit}>
                    <div style = {{display: "flex", flexDirection: "column",  height: "100vh", justifyContent: "center", alignItems: "center"}}>
                        <label>Email</label>
                        <input type="email" required value = {email} onChange={(e) => setEmail(e.target.value)}/>
                        <label>Password</label>
                        <input type="password" required value = {password} onChange = {(e) => setPassword(e.target.value)}/>
                        <button type = "submit">Send</button>
                    </div>
                </form>
            </div>
        </Layout>
    )
    */

    return(
    <Layout props = {user}>
<div
    style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }}
>
    <form
        style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            width: "200px"
        }}
        onSubmit={handleLoginSubmit}
    >
        <label style = {{display: "flex", justifyContent: "center"}}>Email</label>

        <div style={{ marginBottom: "15px" }}>
            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={{ width: "100%", boxSizing: "border-box", borderColor: fieldErrors.email ? "red" : undefined}}
            />

            {fieldErrors.email && (
                <span
                    style={{
                        display: "block",
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",
                    }}
                >
                    {fieldErrors.email}
                </span>
            )}
        </div>

        <label style = {{display: "flex", justifyContent: "center"}}>Password</label>

        <div style={{ marginBottom: "15px" }}>
            <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={{ width: "100%", boxSizing: "border-box", borderColor: fieldErrors.email ? "red" : undefined }}
            />

            {fieldErrors.password && (
                <span
                    style={{
                        display: "block",
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",
                    }}
                >
                    {fieldErrors.password}
                </span>
            )}
        </div>

        <button type="submit">
            Send
        </button>
    </form>
</div>
    </Layout>
    )


}