import { Fragment, useCallback, useEffect, useState } from "react";
import {
  IAnswer,
  IQuestionQuestion,
  ISelectedValue,
  SelectedValue,
} from "../types";
import { Listbox } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
interface ISelectMult {
  placeholder: string;
  label?: string;
  options?: IAnswer[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
  // value?: string[];
  value?: SelectedValue[];
  errors?: any;
  trigger?: any;
}
interface RootState {
  dataa: {
    validationSelect: boolean;
  };
}
const SelectMult = ({
  label,
  options,
  register,
  value,
  placeholder,
  errors,
  trigger,
}: ISelectMult) => {
  // const [selected, setSelected] = useState(value);
  // const [selected, setSelected] = useState(value?.[0]);
  // const [selected, setSelected] = useState<SelectedValue[]>(value || []);
  const [selected, setSelected] = useState<SelectedValue[]>([]); // Updated version

  const selectValid = useSelector(
    (state: RootState) => state.dataa.validationSelect
  );

  useEffect(() => {
    setSelected(value || []);
  }, []);

  return (
    <Listbox
      multiple
      as="div"
      // placeholder={"Rus Dili"}
      placeholder={placeholder}
      // onBlur={handleErrors}
      value={selected}
      className="flex flex-col gap-2"
      onChange={
        // Updated version 26.09.2023
        (value : SelectedValue[]) => {
          setSelected(value);
          register.onChange({
              target: {
                name: register.name,
                value : value,
              },
            });
        }
        // (value : SelectedValue[]) => { // selected options
        // console.log('Selected Value:', value); // Check if onChange is
        // setSelected(value);
        // register.onChange({
        //   target: {
        //     name: register.name,
        //     // value : value.answer?.map((item)=> item),
        //     value : value,
        //   },
        // });
        // }
      }
    >
      <Listbox.Label>{label}</Listbox.Label>
      <div className="w-full relative">
        <Listbox.Button as={Fragment}>
          {({ value, open }) => (
            <Listbox.Label
              className={`relative w-full border-2 transition duration-200  ${
                errors && selectValid ? "border-red-300 border-2" : ""
              } text-left flex items-center text-qss-inputText bg-qss-input py-2 px-4 rounded-full outline-none ${
                open && "text-qss-secondary border border-qss-base-200"
              }`}
            >
              <span
                className={`w-96 overflow-hidden whitespace-nowrap flex ${
                  value.length > 0 ? "text-qss-inputText" : "text-qss-base-300"
                  // value ? "text-qss-inputText" : "text-qss-base-300"
                }`}
              >
                {console.log("value-open", value, open)}
                {value?.[value?.length - 1]?.answer_title || placeholder}
              </span>
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
        <Listbox.Options className="absolute z-10 top-10 bg-qss-input ml-4 rounded w-full max-w-[245px] text-qss-inputText text-sm">
          {options?.map((option) => (
            <Listbox.Option
              key={option.id}
              className="px-4 py-2.5 flex items-center justify-between group hover:bg-qss-base-400 cursor-pointer hover:text-qss-secondary hover:font-medium"
              value={option}
            >
              {({ selected }) => (
                <>
                  <span
                    className={selected ? "text-qss-secondary font-medium" : ""}
                  >
                    {option.answer_title}
                  </span>
                  <span
                    className={`${
                      selected
                        ? "bg-qss-secondary"
                        : "opacity-0 group-hover:opacity-100 bg-white"
                    } w-3 h-3 inline-flex  rounded-full border border-qss-base-200`}
                  ></span>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default SelectMult;