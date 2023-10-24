import LoginRegisterButton from "pages/Auth/components/LoginRegisterButton";
import LoginRegisterTextInput from "pages/Auth/components/LoginRegisterTextInput";
import LoginRegisterPasswordInput from "pages/Auth/components/LoginRegisterPasswordInput";
import LoginRegisterSelect from "pages/Auth/components/LoginRegisterSelect";
import TalentScore from 'assets/logo-second.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import LoginRegisterDatePickerInput from "pages/Auth/components/LoginRegisterDateInput";
import axios from "axios";
import axiosInstance from "axioss";
import { useEffect, useState } from "react";
import useAuth from "hooks/useAuth";
import SelectSearch from "components/SelectSearch";

export type IRegisterFormValues = Yup.InferType<typeof RegisterSchema>;

const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(3, "Name must be minimum 3 characters").required("Please enter the fullname"),
    surname: Yup.string().min(5, "Surname must be minimum 3 characters").required("Please enter the surname"),
    country: Yup.object().shape({
        answer:Yup.string().required("Please enter the country"),
        answer_weight:Yup.string()
    }),
    nativelanguage: Yup.string().min(5).required("Please enter the language"),
    gender: Yup.string().required("Please enter the gender"),
    email: Yup.string().required("Email is required").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter the valid email"),
    password: Yup.string().required("Password is required").min(8, "Password length must be minimum 8 characters ").max(50),
    confirmpassword: Yup.string().required().oneOf([Yup.ref('password')], 'Please confirm password'),
    day: Yup.string().required(""),
    month: Yup.string().required(""),
    year: Yup.string().required("")
})
const RegisterSection = () => {
    const { register, handleSubmit, watch, formState: { errors }, trigger, reset } = useForm<IRegisterFormValues>({
        resolver: yupResolver(RegisterSchema),
        defaultValues: {
            name: "",
            surname: "",
            gender: "",
            country: {
                answer:'',
                answer_weight:''
            },
            nativelanguage: "",
            email: "",
            password: "",
            confirmpassword: "",
            day: "",
            month: "",
            year: "",
        }
    });



    const [countryList, setCountryList] = useState({})
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth()


    useEffect(() => {
        if (user.first_name) {
            navigate('/')
        }
    }, [user])

    useEffect(() => {
        async function getCountries() {
            const { data } = await axiosInstance('user/get-countries')
            setCountryList((last) => {
                return data.map((elem: any, index: number) => {
                    return {
                        id: index,
                        answer_title: elem.name,
                        stage_fit: "",
                        answer_weight: '',
                        answer_dependens_on: null,

                    }
                })
            })
        }
        getCountries()
    }, [])

    const onSubmit: SubmitHandler<IRegisterFormValues> = data => {
        const sendedData = {
            first_name: data.name,
            last_name: data.surname,
            birth_date: Number(data.year) + "-" + Number(data.month) + "-" + Number(data.day),
            gender: data.gender,
            native_language: data.nativelanguage,
            country: data.country.answer,
            email: data.email,
            password: data.password,
            password2: data.confirmpassword
        }

        console.log(sendedData);


        const signUp = async () => {

            try {
                const response = await axiosInstance.post('user/register/', JSON.stringify(sendedData))

                setLoading(false)
                console.log('success');

                navigate('/login')
            } catch (error) {
                setLoading(false)
            }
        }
        signUp()

    };


    return (
        <div className="px-20 py-16 bg-white w-6/12 flex flex-col gap-14 ">
            <div className="flex items-center justify-start gap-5" >
                <img className="w-44" src={TalentScore} alt="Logo" />
                <h3 className="font-manrope text-2xl font-medium text-qss-primary">Welcome Back!</h3>
            </div>

            <div className=" gap-5 flex flex-col w-full">
                <form className="flex flex-col gap-1 overflow-auto w-9/12 h-[500px]" onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-2 flex flex-col gap-7 overflow-auto w-full h-[500px]">
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1">
                                <LoginRegisterTextInput errors={errors.name} label="Name" type="" icon="" register={register("name")} value={watch("name")} trigger={trigger} name="name" />
                                <p className="text-red-500  leading-4">{errors.name ? errors.name.message : ""}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <LoginRegisterTextInput errors={errors.surname} label="Surname" type="" icon="" register={register("surname")} value={watch('surname')} trigger={trigger} name="surname" />
                                <p className="text-red-500 leading-4">{errors.surname ? errors.surname.message : ""}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <LoginRegisterDatePickerInput label="Birth Date" register={register} day='day' month='month' year="year" errors={errors} trigger={trigger} reset={reset} />
                            <p className="text-red-500  leading-4">{(errors.day || errors.month || errors.year) ? "Please enter the birth date" : ""}</p>

                        </div>
                        <div className="flex flex-col gap-1 ">
                            <LoginRegisterSelect errors={errors.gender} label="Gender" options={["Male", "Female"]} register={register('gender')} defaultvalue="Gender..." value={watch('gender')} />
                            <p className="text-red-500  leading-4">{errors.gender ? errors.gender.message : ""}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <LoginRegisterTextInput errors={errors.country} label="Country" type="select" icon="" register={register("country")} value={watch('country')} options={countryList} trigger={trigger} name="country" />

                        
                            <p className="text-red-500  leading-4">{errors.country ? errors.country.message : ""}</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <LoginRegisterTextInput errors={errors.nativelanguage} label="Native Language" type="" icon="pajamas:earth" register={register("nativelanguage")} value={watch("nativelanguage")} trigger={trigger} name="nativelanguage" />


                            <p className="text-red-500  leading-4">{errors.nativelanguage ? errors.nativelanguage.message : ""}</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <LoginRegisterTextInput errors={errors.email} label="E-mail address" type="email" icon="ic:baseline-alternate-email" register={register("email")} value={watch('email')} trigger={trigger} name="email" />
                            <p className="text-red-500  leading-4">{errors.email ? errors.email.message : ""}</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <LoginRegisterPasswordInput errors={errors.password} label="Password" icon="ic:outline-lock" register={register("password")} value={watch('password')} trigger={trigger} name="password" />
                            <p className="text-red-500  leading-4">{errors.password ? errors.password.message : ""}</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <LoginRegisterPasswordInput errors={errors.confirmpassword} label="Confirm Passord" icon="ic:outline-lock" register={register("confirmpassword")} value={watch('confirmpassword')} trigger={trigger} name="confirmpassword" />
                            <p className="text-red-500  leading-4">{errors.confirmpassword ? errors.confirmpassword.message : ""}</p>
                        </div>
                    </div>
                    <LoginRegisterButton type="submit" text={`${loading ? 'Loading...' : 'Sign up'}`} buttonClassName={`${loading ? 'disabled' : ''}w-full bg-qss-primary rounded-3xl  p-3 text-center text-white mt-3 `} />
                    <p className="w-full text-end text-qss-primary font-normal cursor-pointer my-3">Forgot Password?</p>
                    <p className="text-center w-[405px]"> Already have an account? <Link to={{pathname:'/login'}} className='text-qss-primary'>Log in</Link></p>
                </form>
            </div>
        </div>
    )
}

export default RegisterSection