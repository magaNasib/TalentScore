import { Fragment, useEffect, useState } from "react";
import { IAnswer, ISelectedValue } from "../types";
import { Listbox } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
interface ISelect {
  label?: string;
  options?: IAnswer[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
  value?: ISelectedValue;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: any;
  errors?: any
  trigger?: any
  name?: string
}
interface RootState {
  dataa: {
    validationSelect: boolean;
  };
}
const Select = ({
  label,
  options,
  register,
  value,
  defaultValue = "Seçin..",
  disabled = false,
  onChange,
  errors,
  trigger,
  name
}: ISelect) => {
  const [selected, setSelected] = useState(value);
  const copy = {
    answer: '',
    answer_weight: ''
  }

  const selectValid = useSelector((state: RootState) => state.dataa.validationSelect);
  // const handleErrors = async () => {
  //   trigger(name)
  // }


  return (
    <Listbox
      as="div"
      placeholder={selected?.answer}
      value={value?.answer === '' || value === undefined ? copy : selected}
      className="flex flex-col gap-2 w-full"
      // onBlur={handleErrors}
      onChange={(value) => {
        // handleErrors()
        setSelected(value);
        register.onChange(
          {
            target: {
              name: register.name,
              value,
            },
          },
          onChange
        );
      }}
      disabled={disabled}
    >
      <Listbox.Label>{label}</Listbox.Label>
      <div className="w-full relative" >
        <Listbox.Button as={Fragment} >
          {({ value, open }) => (
            <Listbox.Label
              className={`relative w-full text-left flex items-center border-2 transition-all duration-200 bg-qss-input py-2 px-4 rounded-full outline-none ${(errors && selectValid) ? "border-red-300 border-2" : ''}  ${open && "text-qss-secondary border border-qss-base-200"
                } ${value?.answer ? "text-qss-secondary" : "text-qss-base-300 "} `}
            >
              {value?.answer || defaultValue}
              <span className={`absolute right-6 ${open && "rotate-180"}`}>
                <Icon
                  width={"1.5rem"}
                  className="text-qss-secondary"
                  icon="material-symbols:arrow-drop-down-rounded"
                />
              </span>
            </Listbox.Label>
          )}
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 min-h-full max-h-40 overflow-y-auto top-10 bg-qss-input ml-4 rounded w-full max-w-[245px] text-qss-inputText text-sm">
          {options?.map(({ id, answer_title, answer_weight }) => (
            <Listbox.Option
              key={id}
              className="px-4 py-2.5 flex items-center justify-between group hover:bg-qss-base-400 cursor-pointer hover:text-qss-secondary hover:font-medium"
              value={{ answer: answer_title, answer_weight: answer_weight }}
            >
              <>
                <span
                  className={
                    value?.answer === answer_title
                      ? "text-qss-secondary font-medium"
                      : ""
                  }
                >
                  {answer_title}
                </span>
                <span
                  className={`${value?.answer === answer_title
                    ? "bg-qss-secondary"
                    : "opacity-0 group-hover:opacity-100 bg-white"
                    } w-3 h-3 inline-flex  rounded-full border border-qss-base-200`}
                ></span>
              </>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default Select;