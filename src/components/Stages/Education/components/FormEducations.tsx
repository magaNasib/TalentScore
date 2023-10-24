import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";

import Radio from "../../../RadioInput";
import Select from "../../../Select";
import TextInput from "../../../TextInput";

import DateInput from "components/DateInput";
import SelectMult from "components/SelectMult";

import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

import {
  addData,
  addElave,
  addErrorsLength,
  addSelect,
  addTehsilPage,
} from "state/dataSlice";
import { EducationQuestionsFormValues } from "../EducationQuestionsForm";
import { IQuestionQuestion } from "types";
import SelectSearch from "components/SelectSearch";

interface RootState {
  dataa: {
    tehsil: string;
    elave: boolean;
  };
}

interface Copy {
  country: any;
  university: string;
  specialty: any;
  local: any;
  tehsil: any;
  date: any;
  criterian: any;
  criteria: {
    lokal_test?: any;
    application?: [
      {
        application_type: string;
        score: any;
      },
      {
        application_type: string;
        language_type: [
          {
            language_name: string;
            language_score: any;
          },
          {
            language_name: string;
            language_score: any;
          }
        ];
      },
      {
        application_type: string;
        score: any;
      },
      {
        application_type: string;
        score: any;
      },
      {
        other_test?: any;
      }
    ];
  };
}

const schema = yup
  .object({
    tehsil: yup
      .object({
        answer: yup.string().required(),
        answer_weight: yup.string().optional().nullable(),
      })
      .required(),
    country: yup
      .object({
        answer: yup.string().required(),
        answer_weight: yup.string().optional().nullable(),
      })
      .required(),
    university: yup.string().required(),
    specialty: yup
      .object({
        answer: yup.string().required(),
        answer_weight: yup.string().optional().nullable(),
      })
      .required(),
    currentWorking: yup.boolean(),
    date: yup
      .object({
        start: yup.string().required(),
        end: yup.string().when("currentWorking", {
          is: (currentWorking: boolean) => currentWorking === true,
          then: () => yup.string().optional().nullable(),
          otherwise: () => yup.string().required(),
        }),
      })
      .required(),
    criterian: yup
      .object({
        answer: yup.string().required(),
        answer_weight: yup.string().optional().nullable(),
      })
      .required(),
    local: yup.object({
      examName: yup.string().when("criterian", {
        is: (criterian: { answer: string; answer_weight: string }) =>
          criterian?.answer === "Lokal imtahan" ||
          criterian?.answer === "Hər ikisi",
        then: () => yup.string().required(),
        otherwise: () => yup.string().optional(),
      }),
      score: yup.number().when("criterian", {
        is: (criterian: { answer: string; answer_weight: string }) =>
          criterian?.answer === "Lokal imtahan" ||
          criterian?.answer === "Hər ikisi",
        then: () =>
          yup
            .number()
            .required()
            .min(0)
            .test(function (value) {
              const maxScore = this.parent.maxScore;
              return value <= maxScore;
            }),
        otherwise: () => yup.string().optional(),
      }),
      maxScore: yup.number().when("criterian", {
        is: (criterian: { answer: string; answer_weight: string }) =>
          criterian?.answer === "Lokal imtahan" ||
          criterian?.answer === "Hər ikisi",
        then: () => yup.number().required().min(0),
        otherwise: () => yup.string().optional(),
      }),
    }),
    otherExam: yup
      .object({
        name: yup.string().optional(),
        score: yup.number().optional(),
        maxScore: yup.number().optional(),
      })
      .optional(),
    application: yup.array().when("criterian", {
      is: (criterian: { answer: string; answer_weight: string }) =>
        criterian?.answer === "Müraciyyət" || criterian?.answer === "Hər ikisi",
      then: () => yup.array().min(1),
      otherwise: () => yup.array(),
    }),
    Att: yup.string().when(["application", "criterian"], {
      is: (
        application: Array<string>,
        criterian: { answer: string; answer_weight: string }
      ) =>
        (application.find((x) => x === "Attestat - GPA") &&
          criterian?.answer === "Müraciyyət") ||
        criterian?.answer === "Hər ikisi",
      then: () => yup.number().min(0).required(),
    }),
    SAT: yup.string().when(["application", "criterian"], {
      is: (
        application: Array<string>,
        criterian: { answer: string; answer_weight: string }
      ) =>
        application.find((x) => x === "SAT") &&
        (criterian?.answer === "Müraciyyət" ||
          criterian?.answer === "Hər ikisi"),
      then: () => yup.number().min(0).required(),
    }),
    GRE: yup.string().when(["application", "criterian"], {
      is: (
        application: Array<string>,
        criterian: { answer: string; answer_weight: string }
      ) =>
        application.find((x) => x === "GRE/GMAT") &&
        (criterian?.answer === "Müraciyyət" ||
          criterian?.answer === "Hər ikisi"),
      then: () => yup.number().min(0).required(),
    }),
    ielts: yup.string().when(["application", "criterian"], {
      is: (
        application: Array<string>,
        criterian: { answer: string; answer_weight: string }
      ) =>
        application.find((x) => x === "Language test (IELTS TOEFL)") &&
        (criterian?.answer === "Müraciyyət" ||
          criterian?.answer === "Hər ikisi"),
      then: () => yup.number().min(0).required(),
    }),
    toefl: yup.string().when(["application", "criterian"], {
      is: (
        application: Array<string>,
        criterian: { answer: string; answer_weight: string }
      ) =>
        application.find((x) => x === "Language test (IELTS TOEFL)") &&
        (criterian?.answer === "Müraciyyət" ||
          criterian?.answer === "Hər ikisi"),
      then: () => yup.number().min(0).required(),
    }),
  })
  .required();

export type AddEduFormValues = yup.InferType<typeof schema>;

type EducationAdd = {
  name: string;
  questions: IQuestionQuestion[] | undefined;
  formData: EducationQuestionsFormValues;
  handleAddEdu: (eduData: AddEduFormValues) => void;
};

const FormEducations = ({
  questions,
  formData,
  handleAddEdu,
  name,
}: EducationAdd) => {

  console.log(formData);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm<AddEduFormValues>({
    resolver: yupResolver<AddEduFormValues>(schema),
    defaultValues: {
      tehsil: {},
      country: {},
      university: "",
      specialty: {},
      date: {},
      criterian: {},
      local: {},
      otherExam: {},
      application: [],
    },
  });

  const [other, setOther] = useState(false);
  const dispatch: Dispatch = useDispatch();
  const [end, setEnd] = useState(false);

  const onSubmit = handleSubmit((data) => {
    console.log("dataaa", data);
  });

  const tehsil = useSelector((state: RootState) => state.dataa.tehsil);
  const elave = useSelector((state: RootState) => state.dataa.elave);

  const [count, setCount] = useState(0);

  const handleDelete = useCallback(
    (elem: any) => {
      const copyy = watch("application")?.indexOf(elem);
      if (copyy !== -1) {
        watch("application")?.splice(copyy as number, 1);
      }

      setCount(count + 1);
    },
    [count]
  );

  console.log("errors", errors);

  const handleClick = () => {
    if (Object.keys(errors).length > 0) {
      dispatch(addSelect(true));
    } else {
      dispatch(addSelect(false));
      if (tehsil !== name) {
        handleAddEdu(watch());
        dispatch(addTehsilPage(1));
      } else {
        handleAddEdu(watch());
        dispatch(addElave(true));
        dispatch(addData(1));
      }
    }
  };
  
  // console.log(questions?.[0]?.answers);
  

  dispatch(addErrorsLength(Object.keys(errors).length));

  useEffect(() => {
    trigger();
    dispatch(addErrorsLength(Object.keys(errors).length));
  }, [
    watch("university"),
    watch("date.start"),
    watch("date.end"),
    watch("currentWorking"),
    watch("country"),
    watch("specialty"),
    watch("criterian"),
    watch("local.examName"),
    watch("local.maxScore"),
    watch("local.score"),
    watch("application"),
    watch("tehsil"),
    watch("Att"),
    watch("SAT"),
    watch("GRE"),
    watch("ielts"),
    watch("toefl"),
  ]);

  const handleEndDate = () => {
    if (watch("currentWorking") === false) {
      setValue("date.end", "currently working");
    } else {
      setValue("date.end", "");
    }
    setEnd(!end);
  };
  

  useEffect(() => {
    if (!elave) {
      setValue("tehsil.answer", name);
    }
  }, [watch("tehsil.answer")]);

  useEffect(() => {
    if (watch("criterian").answer === "Lokal imtahan") {
      setValue("application", []);
    } else if (watch("criterian").answer === "Müraciyyət") {
      setValue("local", {});
    }
  }, [watch("criterian")]);

  console.log("form", formData);

  console.log(watch("application"));
  console.log(register("country"));
  
  return (
    <div className="pe-5" onSubmit={onSubmit}>
      {elave === true && formData?.education.length !== 0 ? (
        <Select
          register={register("tehsil")}
          label={`${formData.education.length + 1}-ci təhsilinizi qeyd edin`}
          errors={errors.tehsil}
          value={watch("tehsil")}
          options={[
            {
              id: 10,
              answer_title: "Peşə təhsili",
              stage_fit: "",
              answer_weight: '',
              answer_dependens_on: null,
            },
            {
              id: 11,
              answer_title: "Bakalavr",
              stage_fit: "",
              answer_weight: '',
              answer_dependens_on: null,
            },
            {
              id: 12,
              answer_title: "Magistratura",
              stage_fit: "",
              answer_weight: '',
              answer_dependens_on: null,
            },
            {
              id: 13,
              answer_title: "PhD",
              stage_fit: "",
              answer_weight: '',
              answer_dependens_on: null,
            },
          ]}
        />
      ) : null}
      <div className="mb-5 mt-3">
        <label>
          <span style={{ color: "#038477" }}>
            {elave === true && formData?.education.length !== 0
              ? watch("tehsil").answer
                ? watch("tehsil").answer
                : formData.education.length + 1 + "-ci"
              : name}
          </span>
          {` ${questions?.[0]?.question_title}`}
        </label>
        <SelectSearch
          defaultValue="Ölkə"
          label=""
          errors={errors.country}
          options={questions?.[0]?.answers}
          value={watch("country")}
          register={register("country")}
        />
      </div>

      <div className="mb-5">
        <TextInput
          label={
            elave === true
              ? watch("tehsil").answer === "Peşə təhsili"
                ? "Kollecin adı "
                : questions?.[1]?.question_title
              : tehsil === "Peşə təhsili"
              ? "Kollecin adı "
              : questions?.[1]?.question_title
          }
          placeholder="ADNSU"
          value={watch().university}
          register={register("university")}
          errors={errors.university}
        />
      </div>
      <div className="mb-5">
        <SelectSearch
          label={questions?.[2]?.question_title}
          defaultValue="İnformasiya Texnologiyaları"
          errors={errors.specialty}
          options={questions?.[2]?.answers}
          value={watch("specialty")}
          register={register("specialty")}
        />
      </div>

      <div className="flex  items-center gap-3 mb-3">
        <DateInput
          label={
            elave === true
              ? watch("tehsil").answer === "Peşə təhsili"
                ? "Kollecə qəbul olma tarixi  "
                : "Universitetə  qəbul olma tarixi"
              : tehsil === "Peşə təhsili"
              ? "Kollecə qəbul olma tarixi  "
              : "Universitetə  qəbul olma tarixi"
          }
          type="date"
          errors={errors.date?.start}
          register={register("date.start")}
        />
        <DateInput
          label={
            elave === true
              ? watch("tehsil").answer === "Peşə təhsili"
                ? "Kolleci bitirmə tarixi "
                : "Universiteti  bitirmə tarixi"
              : tehsil === "Peşə təhsili"
              ? "Kolleci bitirmə tarixi "
              : "Universiteti  bitirmə tarixi"
          }
          type="date"
          errors={errors.date?.end}
          register={register("date.end")}
          disabled={end === true ? true : false}
        />
      </div>
      <div className="flex w-full justify-end">
        <label className="self-end">
          Hal hazırda oxuyuram
          <input
            type="checkbox"
            onClick={handleEndDate}
            {...register("currentWorking")}
            className="ms-1"
          />
        </label>
      </div>
      <label className="mt-5">{questions?.[4]?.question_title}</label>
      <div className="flex items-center justify-between mt-3 mb-3">
        <Radio
          value={watch().criterian}
          options={questions?.[4]?.answers}
          errors={errors.criterian}
          trigger={trigger}
          register={register("criterian")}
        />
      </div>
      {watch()?.criterian?.answer === "Lokal imtahan" ? (
        <div>
          <label>{questions?.[5]?.question_title}</label>
          <div className="flex gap-5">
            <div className="w-4/4">
              <TextInput
                placeholder="Imtahan"
                register={register("local.examName")}
                errors={errors?.local?.examName}
              />
            </div>
            <TextInput
              placeholder="bal"
              register={register("local.score")}
              errors={errors?.local?.score}
              type="number"
            />
            <TextInput
              placeholder="max bal"
              register={register("local.maxScore")}
              errors={errors?.local?.maxScore}
              type="number"
            />
          </div>
        </div>
      ) : null}
      {watch()?.criterian?.answer === "Müraciyyət" ? (
        <div>
          <label>{questions?.[6]?.question_title}</label>
          <div className="flex">
            <div className="w-8/12">
              <SelectMult
                options={questions?.[6]?.answers}
                label=""
                placeholder="Attestat - GPA"
                register={register("application")}
                errors={errors.application}
              />
            </div>
            <button
              className="ms-5  rounded-full bg-qss-input px-[30px] transition duration-500   py-[2px] hover:text-qss-secondary"
              onClick={() => setOther(!other)}
            >
              Əlavə et +
            </button>
          </div>
        </div>
      ) : null}
      {watch()?.criterian?.answer === "Hər ikisi" ? (
        <div>
          <label>{questions?.[5]?.question_title}</label>
          <div className="flex gap-5 my-3">
            <div className="w-4/4">
              <TextInput
                placeholder="Imtahan"
                register={register("local.examName")}
                errors={errors.local?.examName}
              />
            </div>
            <TextInput
              placeholder="bal"
              register={register("local.score")}
              errors={errors?.local?.score}
              type="number"
            />
            <TextInput
              placeholder="max bal"
              register={register("local.maxScore")}
              errors={errors?.local?.maxScore}
              type="number"
            />
          </div>
          <label>{questions?.[6]?.question_title}</label>
          <div className="flex">
            <div className="w-8/12 ">
              <SelectMult
                options={questions?.[6]?.answers}
                placeholder="Attestat - GPA"
                register={register("application")}
                errors={errors.application}
              />
            </div>
            <button
              className="ms-5  rounded-full bg-qss-input px-[30px] transition duration-500  hover:text-qss-secondary"
              onClick={() => setOther(!other)}
            >
              Əlavə et +
            </button>
          </div>
        </div>
      ) : null}
      {watch()?.criterian?.answer === "Hər ikisi" ||
      watch()?.criterian?.answer === "Müraciyyət" ? (
        <div>
          {watch("application")?.map((elem, index) => {
            console.log(elem);
            
            
            return (
              <div key={index} className={`${elem}`}>
                <div className={` border rounded-xl p-5 mt-5 `}>
                  <div className="flex justify-between  mb-3">
                    <label>
                      <span style={{ color: "#038477" }}>{elem?.answer_title}</span> üzrə,
                      nəticəni qeyd edin
                    </label>
                    <Icon
                      icon="typcn:delete-outline"
                      className="cursor-pointer text-2xl text-[#EE4A4A]/75 hover:text-[#EE4A4A]"
                      onClick={() => handleDelete(elem)}
                    />
                  </div>
                  {elem?.answer_title === "Language test (IELTS TOEFL)" ? (
                    <div>
                      <div className="mb-5">
                        <TextInput
                          placeholder="İELTS Nəticə"
                          register={register("ielts")}
                          errors={errors.ielts}
                          type="number"
                        />
                      </div>
                      <TextInput
                        placeholder="TOEFL Nəticə"
                        register={register("toefl")}
                        errors={errors.toefl}
                        type="number"
                      />
                    </div>
                  ) : (
                    <TextInput
                      placeholder="Nəticə"
                      register={register(elem?.answer_title.substr(0, 3))}
                      errors={
                        elem?.answer_title.substr(0, 3) === "Att"
                          ? errors.Att
                          : elem?.answer_title.substr(0, 3) === "SAT"
                          ? errors.SAT
                          : elem?.answer_title.substr(0, 3) === "GRE"
                          ? errors.GRE
                          : undefined
                      }
                      type="number"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {other ? (
        <div className="border rounded-xl p-5 mt-5">
          <div className="flex justify-between  mb-3">
            <label>
              Seçdiyiniz imtahanın adını,balınızı və max.bal qeyd edin
            </label>
            <Icon
              icon="typcn:delete-outline"
              className="cursor-pointer text-2xl text-[#EE4A4A]/75 hover:text-[#EE4A4A]"
              onClick={() => setOther(false)}
            />
          </div>
          <div className="flex gap-3">
            <div className="w-3/4">
              <TextInput
                placeholder="Testin adı"
                register={register("otherExam.name")}
              />
            </div>

            <TextInput
              placeholder="Balınız"
              register={register("otherExam.score")}
              type="number"
            />

            <TextInput
              placeholder="Maksimal Bal"
              register={register("otherExam.maxScore")}
              type="number"
            />
          </div>
        </div>
      ) : null}
      <div className="w-full flex items-center justify-center mt-5">
        <button
          onClick={handleClick}
          className="bg-qss-saveBtn px-12 py-2.5 items-center gap-1 font-medium text-white flex mt-5 mx-auto opacity-50 rounded-full hover:opacity-100 transition duration-500"
        >
          Yadda saxla
          <Icon
            icon="tabler:check"
            className="text-white"
            style={{ fontSize: "25px" }}
          />
        </button>
      </div>
    </div>
  );
};

export default FormEducations;
