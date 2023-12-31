import LoginRegisterTextInput from "pages/Auth/components/LoginRegisterTextInput";
import TalentScore from 'assets/logo-second.svg'
import LoginRegisterButton from "pages/Auth/components/LoginRegisterButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup'
import { useForm, SubmitHandler } from 'react-hook-form'
import LoginRegisterPasswordInput from "pages/Auth/components/LoginRegisterPasswordInput";
import { useEffect, useState } from "react";
import axios from "axios";
// import { axiosInstance } from "services/api";

import useAuth from '../../../../hooks/useAuth.js'
import useAxiosPrivate from 'hooks/useAxiosPrivate'
import axiosInstance from "axioss/index.js";

// import { toast } from "react-toastify";


const LoginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter the valid email"),
    password: Yup.string().required("Password is required").min(8, "Password length must be minimum 8 characters ").max(50)
})



export type IloginFormValues = Yup.InferType<typeof LoginSchema>;

const LoginSection = () => {
    const { setAccessToken, setCSRFToken } = useAuth()

    const usenavigate = useNavigate();
    const location = useLocation()

    const fromLocation = location?.state?.from?.pathname || '/profile'
    const [loading, setLoading] = useState(false)
    const [isValid, setIsValid] = useState(true)


    const axiosPrivateInstance = useAxiosPrivate()

    const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm<IloginFormValues>({
        resolver: yupResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const { user } = useAuth()


    useEffect(() => {
        if (user.first_name) {
            usenavigate('/')
        }
    }, [user])

    const handleLogin = async (userData: object) => {


        setLoading(true)


        try {
            const response = await axiosInstance.post('user/login/', JSON.stringify(userData))

            console.log(response);

            localStorage.setItem('access_token', response?.data?.access_token)
            setAccessToken(response?.data?.access_token)

            setCSRFToken(response.headers["x-csrftoken"])
            setLoading(false)

            usenavigate(fromLocation, { replace: true })
            setIsValid(true)


        } catch (error) {
            setLoading(false)
            setIsValid(false)
            console.log(error);
        }
    }
    const onSubmit: SubmitHandler<IloginFormValues> = data => {
        const sendedData = {
            email: data.email,
            password: data.password
        }

        handleLogin(sendedData)


    };
    return (
        <div className="px-20 py-16 bg-white w-6/12 flex flex-col gap-14 ">
            <div className="flex items-center justify-start gap-7 w-[405px]" >
                <img className="w-44" src={TalentScore} alt="Logo" />
                <h3 className="font-manrope text-2xl font-medium text-qss-primary">Welcome Back!</h3>
            </div>

            <div className=" gap-5 flex flex-col w-[405px]">
                <form className="flex flex-col gap-4" method="post" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1">
                        <LoginRegisterTextInput errors={errors.email} label="E-mail ünvanı" type="" icon="ion:person-outline" register={register("email")} value={watch('email')} trigger={trigger} name="email" />
                        <p className="text-red-500 leading-4">{errors.email ? errors.email.message : ""}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <LoginRegisterPasswordInput errors={errors.password} label="Şifrə" icon="material-symbols:lock-outline" register={register("password")} value={watch('password')} trigger={trigger} name="password" />
                        <p className="text-red-500 leading-4">{errors.password ? errors.password.message : ""}</p>
                    </div>

                    <LoginRegisterButton type="submit" buttonClassName={`${loading ? 'disabled' : ''} w-full bg-qss-primary rounded-3xl p-3 text-center text-white `} text={`${loading ? 'Loading...' : 'Daxil ol'}`} />
                </form>
                {
                    !isValid &&
                    <p className="text-red-500 text-center text-lg">
                        Email or password is incorrect
                    </p>
                }
                <p className="w-full text-end text-qss-primary font-normal cursor-pointer">Şifrənizi unutmusunuz?</p>
                <p className="text-center w-[405px]"> Hesabınız yoxdur? <Link to={{pathname:'/register'}} className='text-qss-primary'>Create an account</Link></p>
            </div>
        </div>
    );
}

export default LoginSection