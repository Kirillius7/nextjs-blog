import Store from "@/Server/Store/Store";
import { api } from "@lib/api";
import Layout from "components/layout";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";

export const getServerSideProps = Store.getServerSideProps("authController");

export default function registrationPage({data}){
    const[user] = useState(data.identity);
    const[username, setUserName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[role, setRole] = useState("");

    const router = useRouter();
    /*
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username, email, password, role})
            });

            const data = await response.json();
            if(!response.ok){
                throw new Error(data.message || "Помилка при реєстрації")
            }
        console.log("Успішна реєстрація! Користувача створено:", data);
      
        // Після успішної реєстрації перенаправляємо на сторінку логіну
        router.push("/login"); 
        
        } catch (err: any) {
            //setError(err.message || "Сталася помилка при спробі зареєструватися");
        } finally {
            //setLoading(false);
        }
    }*/
   
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            await api.xSave("register", form);
            router.push("/login");
            toast.success("You've successfully registered! Please log in.");
        }
        catch(err: any){
            const details = err?.details;
            if(Array.isArray(details)){
                const errorsMap: Record<string, string> = {};
                details.forEach((errorItem: any) => {

                    const fieldName = errorItem.instancePath ? errorItem.instancePath.replace("/", "") : 
                        errorItem.params?.missingProperty;

                    if(fieldName){
                        errorsMap[fieldName] = errorItem.message || "Invalid value";
                    }
                });
                setFieldErrors(errorsMap);
            }
        }
        


    }

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: ""
    });
    const [fieldErrors, setFieldErrors] =  useState<Record<string, string>>({});

    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }))

        if(fieldErrors[name]){
            setFieldErrors((prev) => ({...prev, [name]: ""}));
        }
    }

    return(
        <Layout props = {user}>
<div
    style={{
        display: "flex",
        minHeight: "70vh",
        justifyContent: "center",
        alignItems: "center"
    }}
>
    <form
        style={{
            display: "flex",
            width: "300px",
            flexDirection: "column"
        }}
        onSubmit={handleRegisterSubmit}
    >
        <div
            style={{
                display: "flex",
                width: "100%",
                flexDirection: "column"
            }}
        >

            {/* USERNAME */}
            <label
                style={{
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                Username
            </label>

            <div
                style={{
                    width: "100%",
                    marginBottom: "15px"
                }}
            >
                <input
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        borderColor: fieldErrors.username
                            ? "red"
                            : undefined
                    }}
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                />

                {fieldErrors.username && (
                    <span
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "4px",
                            color: "red",
                            fontSize: "12px",
                            overflowWrap: "break-word"
                        }}
                    >
                        {fieldErrors.username}
                    </span>
                )}
            </div>


            {/* EMAIL */}
            <label
                style={{
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                Email
            </label>

            <div
                style={{
                    width: "100%",
                    marginBottom: "15px"
                }}
            >
                <input
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        borderColor: fieldErrors.email
                            ? "red"
                            : undefined
                    }}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />

                {fieldErrors.email && (
                    <span
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "4px",
                            color: "red",
                            fontSize: "12px",
                            overflowWrap: "break-word"
                        }}
                    >
                        {fieldErrors.email}
                    </span>
                )}
            </div>


            {/* PASSWORD */}
            <label
                style={{
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                Password
            </label>

            <div
                style={{
                    width: "100%",
                    marginBottom: "15px"
                }}
            >
                <input
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        borderColor: fieldErrors.password
                            ? "red"
                            : undefined
                    }}
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />

                {fieldErrors.password && (
                    <span
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "4px",
                            color: "red",
                            fontSize: "12px",
                            overflowWrap: "break-word"
                        }}
                    >
                        {fieldErrors.password}
                    </span>
                )}
            </div>


            {/* ROLE */}
            <label
                style={{
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                Role
            </label>

            <div
                style={{
                    width: "100%",
                    marginBottom: "15px"
                }}
            >
                <input
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        borderColor: fieldErrors.role
                            ? "red"
                            : undefined
                    }}
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                />

                {fieldErrors.role && (
                    <span
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "4px",
                            color: "red",
                            fontSize: "12px",
                            overflowWrap: "break-word"
                        }}
                    >
                        {fieldErrors.role}
                    </span>
                )}
            </div>


            {/* BUTTON */}
            <button type="submit">
                Confirm
            </button>

        </div>
    </form>
</div>
        </Layout>
    )
}