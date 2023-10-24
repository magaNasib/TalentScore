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
  errors: any;
  onChange?: any;
  className?: string;
}
interface RootState {
  dataa: {
    validationSelect: boolean;
  };
}
const SelectSearch = ({
  label,
  options,
  register,
  value,
  defaultValue,
  errors,
  disabled = false,
  onChange,
  className
}: ISelect) => {
  const [selected, setSelected] = useState(value);
  const [q, setQ] = useState('');
  const selectValid = useSelector((state: RootState) => state.dataa.validationSelect);
  let datas = Object.values(options!);
  function search(params: Array<object>) {
    let copy = params.filter(
      (item: any) => (item.answer_title)?.toLowerCase().indexOf(q.toLocaleLowerCase()) > -1
    );
    return copy
    // if (a) {
    //   return copy = params
    // }else{
    //   return copy
    // }

  }
  const handlechange = (e: any) => {
    setQ(e.target.value)
  }
  const handleClick = () => {
    setQ('')

  }
  return (
    <Listbox
      as="div"
      placeholder={selected?.answer}
      value={selected}
      className={`flex flex-col gap-2 w-full `}
      onChange={(value) => {
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
      <div className="w-full relative">
        <Listbox.Button as={Fragment}>
          {({ value, open }) => (
            <Listbox.Label
              className={`relative w-full text-left flex transition duration-200 border-2 ${className} ${errors && selectValid ? 'border-red-300 ' : ''} items-center border  bg-qss-input py-2 px-4 rounded-full outline-none ${open && "text-qss-secondary border border-qss-base-200"
                } ${value?.answer ? "text-qss-secondary" : "text-qss-base-300"} `}
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
        <Listbox.Options onKeyDown={(e: any) => {
          if (e.key === " ") {
            e.preventDefault()
            e.target.value += ' '
          }
        }} className="absolute z-10 min-h-full max-h-40 overflow-y-auto top-10 bg-qss-input ml-4 rounded w-full max-w-[245px] text-qss-inputText text-sm">
          <div className="flex items-center text-2xl pl-2 bg-qss-input">
            <Icon icon="mdi:search" style={{ color: '#7D7D7D' }} />
            <input className="w-full relative focus:outline-none rounded-lg border-none  px-3 py-2 " onChange={handlechange} placeholder="Axtarın..." />

          </div>
          {search(datas)?.map((item: any, index: any) => (
            <Listbox.Option
              key={index}
              className=" px-4 py-2.5 flex items-center justify-between group hover:bg-qss-base-400 cursor-pointer hover:text-qss-secondary hover:font-medium"
              value={{ answer: item.answer_title, answer_weight: item.answer_weight }}
              onClick={handleClick}>
              <>
                <span
                  className={
                    value?.answer === item.answer_title
                      ? "text-qss-secondary font-medium"
                      : ""
                  }
                >
                  {item.answer_title}
                </span>
                <span
                  className={`${value?.answer === item.answer_title
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

export default SelectSearch;
