import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "./login.service";

export const LoginPage = () => {
    const navigate = useNavigate();

    const {
        data: userData,
        mutate: loginMutation,
        isPending,
        error,
    } = Login();

    const [data, setData] = useState({
        user_email: "",
        user_password: "",
    });


    function handleSubmit(e) {
        e.preventDefault();

        loginMutation(data, {
            onSuccess: () => {
                navigate("/")
            },
            onError: (error) => {
                console.error(
                    error.response?.data?.message || "Login failed"
                );
            },
        });
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-amber-50">
            <div className="h-[500px] w-[700px] flex rounded-md shadow-md">
                <img
                    src="https://ayushcounselling.in/wp-content/uploads/2024/06/Nandha-Ayurveda-Medical-College-and-Hospital-Erode.webp"
                    alt="Login"
                    className="h-[500px] w-[400px] rounded-md object-cover"
                />

                <form
                    onSubmit={handleSubmit}
                    className="h-full w-full bg-gray-100 flex flex-col justify-center items-center rounded-md gap-4"
                >
                    <h1 className="text-2xl">Login</h1>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-700 text-sm">
                            Email:
                        </label>

                        <input
                            type="email"
                            required
                            className="h-[40px] w-[250px] rounded-md p-[3px] bg-white border border-gray-600"
                            placeholder="Enter your email"
                            value={data.user_email}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    user_email: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-700 text-sm">
                            Password:
                        </label>

                        <input
                            type="password"
                            required
                            className="h-[40px] w-[250px] rounded-md p-[3px] bg-white border border-gray-600"
                            placeholder="Enter your password"
                            value={data.user_password}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    user_password: e.target.value,
                                })
                            }
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm">
                            {error.message || "Login failed"}
                        </p>
                    )}

                    <div className="w-full pl-6 mt-2">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 disabled:opacity-50"
                        >
                            {isPending ? "Logging in..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};