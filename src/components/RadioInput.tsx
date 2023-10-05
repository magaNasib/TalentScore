import { RadioGroup } from "@headlessui/react";
import { useState } from "react";
import { IAnswer, ISelectedValue } from "types";
import { useSelector } from "react-redux";
interface IRadioProps {
  options?: IAnswer[];
  label?: string;
  register: any;
  value: ISelectedValue;
  // lang : ISelectedValue | null;
  errors?: any;
  trigger?: any;
}
interface RootState {
  dataa: {
    validationSelect: boolean;
  };
}

const Radio = ({
  options,
  label,
  register,
  value,
  // lang,
  errors,
  trigger,
}: IRadioProps) => {
  const [selected, setSelected] = useState(options?.[0]);
  const selectValid = useSelector(
    (state: RootState) => state.dataa.validationSelect
  );

  const handleErrors = async () => {
    trigger();
  };

  console.log(register.name,value)
  // console.log('radio2',lang)

  return (
    <RadioGroup
      className="w-full"
      value={selected}
      onBlur={handleErrors}
      onChange={(value) => {
        handleErrors();
        setSelected(value);
        register.onChange({
          target: {
            name: register.name,
            value,
          },
        });
      }}
    >
      <RadioGroup.Label>{label}</RadioGroup.Label>
      <div className="flex flex-wrap  gap-3 mt-2 w-full">
        {options?.map(({ id, answer_title, answer_weight }) => (
          <RadioGroup.Option
            key={id}
            value={{ answer: answer_title, answer_weight: answer_weight }}
            className={`bg-qss-input py-2 cursor-pointe flex flex-wrap border-2 transition duration-200  w-full text-sm max-w-[142px] ${
              errors && selectValid ? "border-red-300 border-2" : ""
            }  px-4 gap-1 justify-center items-center flex rounded-full`}
          >
            <span
              className={`whitespace-nowrap relative flex flex-1 justify-center ${
                value?.answer === answer_title
                ? "text-qss-secondary"
                  : "text-qss-inputText"
              }`}
            >
              {answer_title}
            </span>

            <div
              className={`w-2.5 h-2.5 outline rounded-full outline-qss-base-200 ${
                value?.answer === answer_title
                  ? "bg-qss-secondary"
                  : "bg-qss-background"
              }`}
            />
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default Radio;