import calendar from '../assets/Vector (1).svg';
import { useSelector } from 'react-redux';
export interface IDateInputProps {
	label?: string;
	type?: string;
	placeholder?: string;
	register?: any;
	inputClassName?: string;
	disabled?: boolean;
	errors?: any;
	trigger?: any;
}
interface RootState {
	dataa: {
		validationSelect: boolean;
	};
}
const DateInput = ({
	label,
	type,
	placeholder,
	register,
	inputClassName,
	errors,
	trigger,
	disabled
}: IDateInputProps) => {
	const selectValid = useSelector((state: RootState) => state.dataa.validationSelect);
	return (
		<div className={`relative w-full space-y-2 ${inputClassName}`}>
			<label className="pl-2 inline-flex">{label}</label>
			<div className="w-full relative">
				<input
					type={type}
					placeholder={placeholder}
					{...register}
					autoComplete="off"
					className={`&quot;w-full  border-2 transition-all duration-200 ${errors && selectValid ? 'border-red-300' : ''}`}
					disabled={disabled}
				/>
				<img src={calendar} alt="calendar" className="absolute top-2 right-4" />
			</div>
		</div>
	);
};

export default DateInput;
