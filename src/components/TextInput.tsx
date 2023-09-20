import { useSelector } from "react-redux";
interface IInputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  labelClassName?: string;
  inputClassName?: string;
  register?: any;
  value?: string;
  errors?: any;
  min?: number;
  max?: number;
}
interface RootState {
  dataa: {
    validationSelect: boolean;
  };
}
const TextInput = ({
  label,
  type = "text",
  placeholder,
  register,
  inputClassName,
  errors,
  min,
  max,
}: IInputProps) => {
  const selectValid = useSelector(
    (state: RootState) => state.dataa.validationSelect
  );

  return (
    <div className={` ${inputClassName} space-y-2`}>
      {label && <label className="pl-2 inline-flex">{label}</label>}
      <div className={`w-full relative `}>
        <input
          type={type}
          placeholder={placeholder}
          {...register}
          autoComplete="off"
          className={` border-2 transition duration-200 ${
            errors && selectValid ? "border-red-300" : ""
          }`}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};

export default TextInput;
