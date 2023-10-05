import Select from "../../../components/Select";
import { IQuestionQuestion } from "../../../types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Radio from "../../../components/RadioInput";
import TextInput from "../../../components/TextInput";
import { Icon } from "@iconify/react";
import DateInput from "../../DateInput";
import { useEffect } from "react";
import { useAppDispatch } from "state/hooks";
import { addErrorsLength, addOption, addSelect } from "state/dataSlice";

type ExperienceAdd = {
  data: IQuestionQuestion[] | undefined;
  addExp: any;
  closeHandle: () => void;
  editData?: AddExpFormValues | undefined;
  editExp?: any;
  displayRadio: any;
  isAdding?: any;
  setIsAdding?: any;
  experiences?: any;
  setDisplayRadio?: any;
  setIsEditing?: any;
  parentReset?: any;
  formData?: any;
};


const schema = yup.object({
  company: yup.string().required(),
  profession: yup.string().required(),
  workingActivityForm: yup
    .object({
      answer: yup.string().required(),
      answer_weight: yup.string().required(),
    })
    .required(),
  degreeOfProfes: yup
    .object({
      answer: yup.string().required(),
      answer_weight: yup.string().required(),
    })
    .required(),
  startDate: yup.string().required(),
  currentWorking: yup.boolean(),
  endDate: yup.string().when("currentWorking", {
    is: (currentWorking: boolean) => currentWorking === true,
    then: () => yup.string().optional(),
    otherwise: () => yup.string().required(),
  }),
});

export type AddExpFormValues = yup.InferType<typeof schema>;

const ExperienceAdd = ({
  data,
  addExp,
  editData,
  editExp,
  displayRadio,
  setDisplayRadio,
  isAdding,
  setIsAdding,
  setIsEditing,
  experiences,
  parentReset,
  formData,
}: ExperienceAdd) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    trigger,
  } = useForm<AddExpFormValues>({
    resolver: yupResolver<AddExpFormValues>(schema),
    defaultValues: editData,
  });
  const dispatch = useAppDispatch();
  const onSubmit = handleSubmit((data) => {
    // console.log('Experience' + data);
  });

  dispatch(addErrorsLength(Object.keys(errors).length));
  useEffect(() => {
    trigger();
    dispatch(addErrorsLength(Object.keys(errors).length));
  }, [
    watch("company"),
    watch("profession"),
    watch("workingActivityForm"),
    watch("degreeOfProfes"),
    watch("startDate"),
    watch("endDate"),
    watch("currentWorking"),
  ]);

  const inputProps = [
    { register: { ...register("company") } },
    { register: { ...register("profession") } },
    { register: { ...register("workingActivityForm") } },
    { register: { ...register("degreeOfProfes") } },
    { register: { ...register("startDate") } },
    { register: { ...register("endDate") } },
    { register: { ...register("currentWorking") } },
  ];

  const handleClick = () => {
    dispatch(addSelect(true));
    if (Object.keys(errors).length === 0) {
      editExp ? editExp(watch()) : addExp(watch());
    }
  };

  const handleCheck = () => {
    if (watch("currentWorking") === false) {
      setValue("endDate", "currently working");
    } else {
      setValue("endDate", "");
    }
  };

  useEffect(() => {
    if (formData?.haveJobExperience?.answer === "Yoxdur") {
      reset();
      dispatch(addSelect(false));
    }
  }, [formData?.haveJobExperience?.answer]);

  useEffect(() => {
    if (watch().company !== undefined && editData === undefined) {
      parentReset({
        ...formData,
        haveJobExperience: { answer: "Bəli", answer_weight: "" },
      });
    }
  }, [watch("company")]);

  // console.log(errors);
  return (
    <div className="relative flex flex-col gap-2" onSubmit={onSubmit}>
      <>
        <TextInput
          label="Çalışdığınız müəssisənin adını qeyd edin.*"
          type="text"
          placeholder="QSS Analytics"
          register={inputProps[0].register}
          errors={errors.company}
        />
        <TextInput
          label="Vəzifənizi qeyd edin.*"
          type="text"
          placeholder="Product Manager"
          register={inputProps[1].register}
          errors={errors.profession}
        />
        <div className="flex gap-2.5">
          <Select
            label={data?.[2]?.question_title}
            options={data?.[2].answers}
            register={inputProps[2].register}
            value={watch()?.workingActivityForm}
            errors={errors.workingActivityForm}
            trigger={trigger}
          />
          <Select
            label={data?.[6]?.question_title}
            options={data?.[6].answers}
            register={inputProps[3].register}
            value={watch()?.degreeOfProfes}
            errors={errors.degreeOfProfes}
            trigger={trigger}
          />
        </div>
        <div className="flex gap-2.5">
          <DateInput
            label="İşə başlama tarixi:"
            type="date"
            register={inputProps[4].register}
            errors={errors.startDate}
          />
          <DateInput
            label="İşdən ayrılma tarixi:"
            type="date"
            register={inputProps[5].register}
            disabled={watch()?.currentWorking === true ? true : false}
            errors={errors.endDate}
          />
        </div>
        <label className="self-end">
          Hal hazırda oxuyuram{" "}
          <input
            type="checkbox"
            onClick={handleCheck}
            {...inputProps[6].register}
          />
        </label>
        <button
          className="bg-qss-saveBtn px-12 py-2.5 items-center gap-1 font-medium text-white flex mt-2 mx-auto opacity-50 rounded-full hover:opacity-100 transition duration-500"
          type="button"
          onClick={() => {
            handleClick();
          }}
        >
          <span> Yadda saxla </span>
          <Icon
            icon="tabler:check"
            className="text-white"
            style={{ fontSize: "25px" }}
          />
        </button>
        {experiences?.length > 0 && (
          <button
            className="save py-2 px-4 w-40 h-10 rounded-2xl flex justify-evenly self-center bg-qss-secondary text-white"
            onClick={() => {
              isAdding ? setIsAdding() : setIsEditing();
              dispatch(addErrorsLength(0));
            }}
          >
            Siyahıya bax
          </button>
        )}
      </>
    </div>
  );
};

export default ExperienceAdd;