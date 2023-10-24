import { useEffect } from "react";
import * as yup from "yup";
import Radio from "../../../RadioInput";
import Select from "../../../Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IQuestionQuestion } from "../../../../types";
import TextInput from "../../../TextInput";
import { Icon } from "@iconify/react";
import { addErrorsLength, addSelect } from "state/dataSlice";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

type LanguageAdd = {
  data: IQuestionQuestion[] | undefined;
  addLang?: any;
  editData?: AddLangFormValues | undefined;
  editLang?: any;
  setChooseLang?: any;
  isAdding?: any;
  setIsAdding?: any;
  setIsEditing?: any;
  formData?: any;
  parentReset?: any;
};

const schema = yup
  .object({
    language: yup
      .object({
        answer: yup.string().required(),
        weight: yup.string().optional().nullable(),
      })
      .required(),

    langCert: yup
      .object({
        answer: yup.string().required(),
        weight: yup.string().optional().nullable(),
      })
      .when("language", {
        is: (language: any) => language.answer !== "Ingilis dili",
        then: () =>
          yup
            .object({
              answer: yup.string().required(),
              weight: yup.string().optional().nullable(),
            })
            .required(),
        otherwise: () =>
          yup
            .object({
              answer: yup.string().optional(),
              weight: yup.string().optional().nullable(),
            })
            .optional(),
      }),

    engLangCert: yup
      .object({
        answer: yup.string().required(),
        weight: yup.string().optional().nullable(),
      })
      .when("language", {
        is: (language: any) => language.answer === "Ingilis dili",
        then: () =>
          yup
            .object({
              answer: yup.string().required(),
              weight: yup.string().optional().nullable(),
            })
            .required(),
        otherwise: () =>
          yup
            .object({
              answer: yup.string().optional(),
              weight: yup.string().optional().nullable(),
            })
            .optional(),
      }),

    langCertName: yup.string().when(["langCert", "engLangCert"], {
      is: (langCert: any, engLangCert: any) =>
        langCert?.answer === "Bəli" ||
        engLangCert?.answer === "Öz sertifikatın",
      then: () => yup.string().required(),
    }),

    langCertResult: yup.string().when(["langCert", "engLangCert"], {
      is: (langCert: any, engLangCert: any) =>
        langCert?.answer === "Bəli" ||
        engLangCert?.answer === "Öz sertifikatın",
      then: () => yup.number().min(0).required(),
    }),

    engCertResult: yup
      .object({
        answer: yup.string().required(),
        weight: yup.string().optional().nullable(),
      })
      .when(["language", "engLangCert"], {
        is: (language: any, engLangCert: any) =>
          language?.answer === "Ingilis dili" &&
          (engLangCert?.answer === "İELTS" || engLangCert?.answer === "TOEFL"),
        then: () =>
          yup
            .object({
              answer: yup.string().required(),
              weight: yup.string().optional().nullable(),
            })
            .required(),
        otherwise: () =>
          yup
            .object({
              answer: yup.string().optional(),
              weight: yup.string().optional().nullable(),
            })
            .optional(),
      }),

    langLevel: yup
      .object({
        answer: yup.string().required(),
        weight: yup.string().optional().nullable(),
      })
      .when(["engLangCert", "language"], {
        is: (engLangCert: any, language: any) =>
          (language?.answer === "Ingilis dili" &&
            (engLangCert.answer === "Yoxdur" ||
              engLangCert.answer === "Öz sertifikatın")) ||
          language.answer !== "Ingilis dili",
        then: () =>
          yup
            .object({
              answer: yup.string().required(),
              weight: yup.string().optional().nullable(),
            })
            .required(),
        otherwise: () =>
          yup
            .object({
              answer: yup.string().optional(),
              weight: yup.string().optional().nullable(),
            })
            .optional(),
      }),
  })
  .required();

export type AddLangFormValues = yup.InferType<typeof schema>;

const LanguageAdd = ({
  data,
  addLang,
  editData,
  editLang,
  setChooseLang,
  isAdding,
  setIsAdding,
  setIsEditing,
  formData,
  parentReset,
}: LanguageAdd) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<AddLangFormValues>({
    defaultValues: editData,
    resolver: yupResolver<AddLangFormValues>(schema),
  });

  const inputProps = [
    { register: register("language") },
    { register: register("langCert") },
    { register: register("engLangCert") },
    { register: register("langCertName") },
    { register: register("langCertResult") },
    { register: register("engCertResult") },
    { register: register("langLevel") },
  ];

  const dispatch: Dispatch = useDispatch();

  const onSubmit = handleSubmit((data) => {});

  const handleClick = () => {
    if (Object.keys(errors).length > 0) {
      dispatch(addSelect(true));
    } else {
      dispatch(addSelect(false));
      setValue("langLevel", handleLangLevel(watch("engCertResult.answer")));
      editLang ? editLang(watch()) : addLang(watch());
    }
  };

  // console.log(errors);

  const handleLangLevel = (engCertResult: string | undefined) => {
    switch (engCertResult) {
      case "4.0":
      case "4.5-5.0":
      case "32-45":
        setValue("langLevel", { answer: "B1 (İlkin orta)", weight: "" });
        break;
      case "5.5":
      case "6.0":
      case "6.5":
      case "46-59":
      case "60-78":
      case "70-93":
        setValue("langLevel", { answer: "B2 (Orta)", weight: "" });
        break;
      case "7.0-7.5":
      case "94-109":
        setValue("langLevel", { answer: "C1 (Üst orta)", weight: "" });
        break;
      case "8.0-9.0":
      case "110-120":
        setValue("langLevel", { answer: "C2 (İrəli)", weight: "" });
        break;
      case "31":
        setValue("langLevel", { answer: "A2 (Elementar)", weight: "" });
        break;
      default:
        break;
    }
    return watch("langLevel");
  };

  dispatch(addErrorsLength(Object.keys(errors).length));  

  useEffect(() => {
    dispatch(addErrorsLength(Object.keys(errors).length));
    trigger();
  }, [
    watch("language"),
    watch("langCert"),
    watch("langCertName"),
    watch("langCertResult"),
    watch("langLevel"),
    watch("engCertResult"),
    watch("engLangCert"),
  ]);

  useEffect(() => {
    if (formData?.haveLanguageSkills?.answer === "Yoxdur") {
      reset();
      dispatch(addSelect(false));
    }
  }, [formData?.haveLanguageSkills?.answer]);

  useEffect(() => {
    if (watch().language !== undefined && editData === undefined) {
      parentReset({
        ...formData,
        haveLanguageSkills: { answer: "Var", weight: "" },
      });
    }
  }, [watch("language")]);

  useEffect(() => {
    if (!editData) {
      setValue("engCertResult.answer", "");
    }

    if (
      editData &&
      watch("engLangCert.answer") !== editData?.engLangCert?.answer
    ) {
      setValue("engCertResult.answer", "");
    }
  }, [watch("engLangCert.answer")]);

  useEffect(() => {
    if (
      watch("engLangCert.answer") === "Öz sertifikatın" ||
      watch("engLangCert.answer") === "Yoxdur"
    ) {
      setValue("engCertResult", { answer: "", weight: "" });
    }

    if (
      watch("engLangCert.answer") !== "Öz sertifikatın" &&
      watch("language.answer") === "Ingilis dili"
    ) {
      setValue("langCertName", "");
      setValue("langCertResult", undefined);
    }
    if (watch("language.answer") !== "Ingilis dili") {
      setValue("engLangCert", { answer: "", weight: "" });
      setValue("engCertResult", { answer: "", weight: "" });
    }
    if (watch("langCert.answer") === "Xeyr") {
      setValue("langCertName", "");
      setValue("langCertResult", undefined);
    }
    if (
      editData?.language?.answer !== watch("language.answer") &&
      watch("language.answer") === "Ingilis dili"
    ) {
      setValue("langLevel.answer", "");
      setValue("langCert.answer", "");
    }

    if (
      editData?.language?.answer !== watch("language.answer") &&
      editData?.language?.answer === "Ingilis dili" &&
      watch("language.answer") !== "Ingilis dili"
    ) {
      setValue("langCertName", "");
      setValue("langCertResult", undefined);
    }
  }, [
    watch("language.answer"),
    watch("langCert.answer"),
    watch("engLangCert.answer"),
  ]);

  return (
    <div className="w-full">
      <div>
        <Select
          options={data?.[1]?.answers}
          register={inputProps[0].register}
          value={watch()?.language}
          errors={errors.language}
        />
        {watch()?.language?.answer && (
          <div className="absolute">
            {watch()?.language?.answer !== "Ingilis dili" ? (
              <div className="">
                <div className="space-y-2 mt-3">
                  <label className="pl-2">
                    {watch()?.language?.answer?.replace(/\s+dili$/, "")}{" "}
                    {data?.[3]?.question_title}*
                  </label>

                  <div className="flex gap-5 flex-wrap">
                    <Radio
                      options={data?.[3]?.answers}
                      value={watch("langCert")}
                      errors={errors.langCert}
                      register={inputProps[1].register}
                      trigger={trigger}
                    />
                  </div>
                </div>
                {watch().langCert?.answer === "Bəli" && (
                  <div className="space-y-2 my-3">
                    <label className="pl-2">{data?.[4]?.question_title}</label>
                    <div className="certificate flex gap-3 pr-8">
                      <TextInput
                        inputClassName="w-3/5"
                        register={inputProps[3].register}
                        errors={errors.langCertName}
                      />
                      <TextInput
                        inputClassName="w-2/5"
                        register={inputProps[4].register}
                        errors={errors.langCertResult}
                        type="number"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2 mt-3">
                  <label className="pl-2">
                    {watch()?.language?.answer?.replace(/\s+dili$/, "")}{" "}
                    {data?.[2]?.question_title}*
                  </label>

                  <div className="flex gap-5 flex-wrap">
                    <Radio
                      options={data?.[2]?.answers}
                      value={watch("langLevel")}
                      register={inputProps[6].register}
                      errors={errors.langLevel}
                      trigger={trigger}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2 my-3">
                  <label className="pl-2">{data?.[5]?.question_title}*</label>

                  <div className="flex gap-5 flex-wrap">
                    <Radio
                      options={data?.[5]?.answers}
                      value={watch("engLangCert")}
                      register={inputProps[2].register}
                      errors={errors.engLangCert}
                      trigger={trigger}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {watch("engLangCert")?.answer === "İELTS" && (
                    <>
                      <Select
                        label={data?.[6]?.question_title}
                        options={data?.[6]?.answers}
                        register={inputProps[5].register}
                        value={watch("engCertResult")}
                        errors={errors.engCertResult}
                      />
                    </>
                  )}
                  {watch("engLangCert")?.answer === "TOEFL" && (
                    <Select
                      label={data?.[7]?.question_title}
                      options={data?.[7]?.answers}
                      register={inputProps[5].register}
                      value={watch("engCertResult")}
                      errors={errors.engCertResult}
                    />
                  )}
                  {watch("engLangCert")?.answer === "Öz sertifikatın" && (
                    <>
                      <div className="space-y-2">
                        <label className="pl-2">
                          {data?.[4]?.question_title}
                        </label>
                        <div className="certificate flex gap-3 pr-8">
                          <TextInput
                            inputClassName="w-3/5"
                            register={inputProps[3].register}
                            errors={errors.langCertName}
                          />
                          <TextInput
                            inputClassName="w-2/5"
                            register={inputProps[4].register}
                            errors={errors.langCertResult}
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="pl-2">
                          {watch()?.language?.answer?.replace(/\s+dili$/, "")}{" "}
                          {data?.[2]?.question_title}*
                        </label>

                        <div className="flex gap-5 flex-wrap">
                          <Radio
                            options={data?.[2]?.answers}
                            value={watch("langLevel")}
                            register={inputProps[6].register}
                            errors={errors.langLevel}
                            trigger={trigger}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            {watch().engLangCert?.answer === "Yoxdur" && (
              <div className="space-y-2">
                <label className="pl-2">
                  {watch()?.language?.answer?.replace(/\s+dili$/, "")}{" "}
                  {data?.[2]?.question_title}*
                </label>

                <div className="flex gap-5 flex-wrap">
                  <Radio
                    options={data?.[2]?.answers}
                    value={watch("langLevel")}
                    register={inputProps[6].register}
                    errors={errors.langLevel}
                    trigger={trigger}
                  />
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleClick}
              className="bg-qss-saveBtn px-12 py-2.5 items-center gap-1 font-medium text-white flex mt-5 mx-auto opacity-50 rounded-full hover:opacity-100 transition duration-500"
            >
              Yadda saxla
              <Icon icon="ic:round-done" className="text-xl" />
            </button>
            {formData?.languageSkills.length > 0 && (
              <div className="w-full flex items-center justify-center">
                <button
                  className="save py-2 px-4 w-40 h-10 opacity-70 rounded-full hover:opacity-100 transition duration-500 flex justify-evenly self-center bg-qss-secondary text-white my-5"
                  onClick={() => {
                    isAdding ? setIsAdding() : setIsEditing();
                    dispatch(addErrorsLength(0));
                  }}
                >
                  Siyahıya bax
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageAdd;