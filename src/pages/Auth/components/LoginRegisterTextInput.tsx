import { Icon } from '@iconify/react';
import SelectSearch from '../../../components/SelectSearch';

import { useCallback, useEffect, useState } from 'react';
interface ILoginRegisterTextInput {
    label?: string,
    type?: string,
    icon: string,
    register?: any
    errors?: any,
    value?: any,
    trigger?: any,
    name?: string,
    options?: any
}
const LoginRegisterTextInput = ({ label, type, icon, register, errors, value, trigger, name, options }: ILoginRegisterTextInput) => {
    const [inputValue, setInputValue] = useState('')
    const handleErrors = async () => {
        if (trigger(name) && value !== undefined) {
            setInputValue(value)
        }
    }


    return (
        <label className={`${errors ? 'text-red-500' : "text-qss-primary"} w-full flex justify-center flex-col gap-1 `}>
            {label}
            {
                type !== 'select' &&
                <div className={` ${errors ? "border-red-500 focus-within:border-red-500" : "border-qss-border focus-within:bg-transparent"} group border-gray-300  group w-full bg-qss-background border rounded-3xl flex items-center gap-2 py-2 px-3 transition-all duration-300 `}>
                    <Icon icon={icon} className={`${inputValue && !errors ? "text-green-600 group-hover:border-green-600" : errors ? "text-red-500 group-hover:text-red-500" : "group-hover:text-qss-primary"}  text-gray-500 text-lg transition duration-900 `} />

                    <input className={` ${inputValue && !errors ? "text-green-600" : "text-qss-primary"} ${errors && "text-red-500 "} w-full border-0 text-lg  bg-transparent focus:outline-none`} type={type} autoComplete='off' {...register} onBlur={handleErrors} />




                    <Icon icon="material-symbols:error-outline" className={`${errors ? "block" : "hidden"} text-red-500 text-lg`} />
                    <Icon icon={"material-symbols:check-circle-outline"} className={`${inputValue && !errors ? "block" : "hidden"} text-green-600 text-lg`} />
                </div>
            }
            {
                type == 'select' &&
                <SelectSearch
                    errors={errors}
                    defaultValue="Ölkə"
                    label=""
                    value={value}
                    options={options}
                    register={register}
                    className={` ${inputValue && !errors ? "text-green-600" : "text-qss-primary"} ${errors && "text-red-500 "} w-full border-0 text-lg  bg-transparent focus:outline-none relative`}
                    {...register}
                    onBlur={handleErrors}
                />


            }
        </label >
    );
}

export default LoginRegisterTextInput
