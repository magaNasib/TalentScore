import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useGetQuestionsQuery,
  useGetStageQuery,
} from "../../../services/stage";
import Radio from "../../RadioInput";
import LinkButton from "../../LinkButton";
import { updateStageForm } from "../../../state/stages/stageFormSlice";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { GeneralQuestionsFormProps } from "../Education/GeneralQuestionsForm";
import { setShowReport } from "../../../state/report/reportSlice";
import SelectMult from "components/SelectMult";
import { ISelectedValue } from "types";
import ClockLoader from "react-spinners/ClockLoader";
import { addErrorsLength, addSelect } from "state/dataSlice";
import { Link, useNavigate } from "react-router-dom";

export type ProgramSkillsValues =
  | {
    haveProgramSkills: { answer: string; answer_weight: string };
    whichProgram: string[];
    programSkills: any;
    [key: string]: string | any;
  }
  | Partial<Record<string, ISelectedValue | any>>;

const schema = yup.object().shape({
  haveProgramSkills: yup
    .object({
      answer: yup.string().required(),
      answer_weight: yup.string().optional().nullable(),
    })
    .required(),
  whichProgram: yup.array().when("haveProgramSkills", {
    is: (haveProgramSkills: any) => haveProgramSkills.answer !== "Yoxdur",
    then: () => yup.array().min(1).required(),
  }),
});

interface DynamicFieldSelect {
  [fieldName: string]: string[];
}

interface DynamicFieldsSelectItem {
  [fieldName: string]: {
    schema: yup.ObjectSchema<any>;
  };
}

const ProgramSkills = ({
  stageIndex,
  subStageSlug,
}: GeneralQuestionsFormProps) => {
  const { showReport } = useAppSelector((state) => state.reportState);
  const { data: stagesData } = useGetStageQuery();

  const { stage_children } = stagesData?.[stageIndex] || {};

  const {
    slug: nextSlugName,
    stage_name: nextStageName,
    stage_children: nextStageChildren,
  } = stagesData?.[stageIndex + 1] || {};

  const {
    slug: prevSlugName,
    stage_name: prevStageName,
    stage_children: prevStageChildren,
  } = stagesData?.[4] || {};

  const { slug: prevSubSlugName, stage_name: prevSubStageName } =
    prevStageChildren?.[0] || {};

  const { slug: subSlugName } = stage_children?.[0] || {};

  const { slug: nextSubSlugName, stage_name: nextSubStageName } =
    nextStageChildren?.[0] || {};

  const {
    data: questionsData,
    error: questionsError,
    isLoading,
  } = useGetQuestionsQuery(subSlugName);

  const dispatch = useAppDispatch();
  const questions = questionsData?.[0]?.questions;

  const [dynamicFieldsSelect, setDynamicFieldsSelect] = useState<
    DynamicFieldSelect[]
  >([]);

  const [dynamicFieldsSelectItem, setDynamicFieldsSelectItem] =
    useState<DynamicFieldsSelectItem>({});

  const addDynamicFieldSelect = (fieldName: string) => {
    setDynamicFieldsSelect((prevDynamicFields) => ({
      ...prevDynamicFields,
      [fieldName]: [],
    }));
  };

  const addDynamicFieldSelectItem = (fieldName: string) => {
    setDynamicFieldsSelectItem((prev) => ({
      ...prev,
      [fieldName]: {
        schema: yup
          .object()
          .shape({
            answer: yup.string().required(),
            answer_weight: yup.string().optional().nullable(),
          })
          .required(`${fieldName} is required`),
      },
    }));
  };

  const removeDynamicFieldSelect = (fieldName: any) => {
    setDynamicFieldsSelect((prevDynamicFields) => {
      const updatedFields = { ...prevDynamicFields };
      delete updatedFields[fieldName];
      return updatedFields;
    });
  };

  const removeDynamicFieldSelectItem = (fieldName: string) => {
    setDynamicFieldsSelectItem((prevDynamicFields) => {
      const updatedFields = { ...prevDynamicFields };
      delete updatedFields[fieldName];
      return updatedFields;
    });
  };

  const dynamicSchema = yup.object().shape({
    ...schema.fields,
    ...Object.fromEntries(
      Object.entries(dynamicFieldsSelect).map(([fieldName]) => [
        fieldName,
        yup
          .array()
          .min(1)
          .required(`${fieldName} requires at least one element`),
      ])
    ),
    ...Object.fromEntries(
      Object.entries(dynamicFieldsSelectItem).map(([fieldName, field]) => [
        fieldName,
        field.schema,
      ])
    ),
  });

  const { formData } =
    (useAppSelector((state) => state.stageForm)?.find(
      ({ name }) => name === subStageSlug
    ) as { formData: ProgramSkillsValues }) || {};

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<ProgramSkillsValues | any>({
    resolver: yupResolver(dynamicSchema),
    defaultValues: {
      haveProgramSkills: { answer: "", answer_weight: "" },
      whichProgram: [],
      programSkills: [],
    },
  });

  const nav = useNavigate();

  const onSubmit: SubmitHandler<ProgramSkillsValues | any> = (data) => {
    dispatch(setShowReport(!showReport));
    fillSkills();
  };

  useEffect(() => {
    const subscription = watch((value) => {
      trigger();
      dispatch(
        updateStageForm({
          name: subStageSlug,
          formData: value as ProgramSkillsValues,
        })
      );
    });

    reset(formData);

    return () => subscription.unsubscribe();
  }, [subStageSlug, watch, dynamicFieldsSelect, dynamicFieldsSelectItem]);

  useEffect(() => {
    if (formData?.haveProgramSkills?.answer === "Yoxdur") {
      reset({
        haveProgramSkills: { answer: "Yoxdur", answer_weight: null },
        whichProgram: [],
        programSkills: [],
      });
      setDynamicFieldsSelectItem({});
    }
  }, [formData?.haveProgramSkills?.answer]);

  useEffect(() => {
    if (formData?.whichProgram?.length === 1) {
      setValue("haveProgramSkills", { answer: "Var", answer_weight: null });
    } else if (
      formData?.whichProgram?.length === 0 &&
      formData.haveProgramSkills.answer === "Var"
    ) {
      setValue("haveProgramSkills", { answer: "", answer_weight: null });
    }
    setDynamicFieldsSelect([]);
    if (formData?.whichProgram?.length > 0) {
      formData?.whichProgram.map((item: string) => {
        addDynamicFieldSelect(item);
      });
    }
  }, [formData?.whichProgram?.length]);

  const validateAndAddDynamicFields = (fieldName: string) => {
    setDynamicFieldsSelectItem({});
    if (formData?.[fieldName]?.length > 0) {
      formData[fieldName].forEach((item: string) => {
        addDynamicFieldSelectItem(item);
      });
    }
  };

  const useEffectDependences = questions?.[1]?.answers?.map(
    (fieldName: any) => formData?.[fieldName?.answer_title]?.length
  );

  useEffect(() => {
    formData?.whichProgram.forEach((fieldName: string) => {
      validateAndAddDynamicFields(fieldName);
    });
  }, useEffectDependences);

  if (isLoading)
    return (
      <div className="absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
        <ClockLoader color="#038477" />
      </div>
    );
  if (questionsError) return <div>Error</div>;

  const inputProps = [
    { register: register("whichProgram") },
    { register: register("haveProgramSkills") },
  ];

  const fillSkills = async () => {
    if (formData?.whichProgram?.length > 0) {
      const updatedFormData = { ...formData };
      const updatedSkills = await formData.whichProgram
        .filter((fieldName: string) => formData[fieldName]?.length > 0)
        .map((fieldName: string) => {
          const skillLevels = formData[fieldName].map((item: string) => {
            delete updatedFormData[item];
            removeDynamicFieldSelectItem(item);
            return { name: item, value: formData[item] };
          });
          delete updatedFormData[fieldName];
          removeDynamicFieldSelect(fieldName);
          return { whichProgram: fieldName, whichLevel: skillLevels };
        });

      dispatch(addSelect(false));

      reset({
        haveProgramSkills: { answer: "Var", answer_weight: null },
        whichProgram: formData?.whichProgram || [],
        programSkills: updatedSkills,
      });

      nav("/");
    }
  };

  console.log("errors", errors);
  console.log(formData);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-7 flex-col flex gap-5 mb-5"
    >
      <div className="space-y-5">
        <div>
          <label>{`${questions?.[1]?.question_title}*`}</label>
          <div className="flex items-center gap-2">
            <div className="w-[70%]">
              <SelectMult
                value={formData?.whichProgram}
                options={questions?.[1]?.answers}
                register={inputProps[0].register}
                placeholder="Select Programs"
                trigger={trigger}
                errors={errors.whichProgram}
              />
            </div>
            <div className="flex gap-5 w-48 py-2 px-4">
              <Radio
                value={formData?.haveProgramSkills}
                register={inputProps[1]?.register}
                options={questions?.[0]?.answers}
                errors={errors.haveProgramSkills}
                trigger={trigger}
              />
            </div>
          </div>
        </div>
        {formData?.whichProgram?.length > 0 ? (
          <div className="overflow-y-auto h-[350px] pb-4 space-y-4 pr-5">
            {formData?.whichProgram?.includes("MS Office") && (
              <>
                <SelectMult
                  label={`${questions?.[2]?.question_title}*`}
                  options={questions?.[2]?.answers.slice(0, 3)}
                  placeholder="Select Programs"
                  register={register("MS Office")}
                  value={formData?.["MS Office"]}
                  trigger={trigger}
                  errors={errors?.["MS Office"]}
                />
                {formData?.["MS Office"]?.length > 0 &&
                  formData?.["MS Office"]?.map((lang: any, index: any) => {
                    const checkError = errors[lang] ? errors[lang] : "";

                    return (
                      <div key={index} className="space-y-2">
                        <label className="pl-2">
                          {lang + " " + questions?.[3]?.question_title}*
                        </label>
                        <div className="flex gap-5">
                          <Radio
                            options={questions?.[3]?.answers}
                            value={watch(lang)}
                            register={register(lang)}
                            trigger={trigger}
                            errors={checkError}
                          />
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
            {formData?.whichProgram?.includes("Proqramlaşdırma dilləri") && (
              <>
                <SelectMult
                  label={`${questions?.[4]?.question_title}*`}
                  options={questions?.[4]?.answers.slice(0, 3)}
                  register={register("Proqramlaşdırma dilləri")}
                  value={formData?.["Proqramlaşdırma dilləri"]}
                  trigger={trigger}
                  placeholder="Select Programs"
                  errors={errors?.["Proqramlaşdırma dilləri"]}
                />
                {formData?.["Proqramlaşdırma dilləri"]?.length > 0 &&
                  formData?.["Proqramlaşdırma dilləri"]?.map(
                    (lang: any, index: any) => {
                      const checkError = errors[lang] ? errors[lang] : "";
                      return (
                        <div key={index} className="space-y-2">
                          <label className="pl-2">
                            {lang + " " + questions?.[5]?.question_title}*
                          </label>
                          <div className="flex gap-1">
                            <Radio
                              options={questions?.[5]?.answers}
                              value={watch(lang)}
                              register={register(lang)}
                              trigger={trigger}
                              errors={checkError}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
              </>
            )}
            {formData?.whichProgram?.includes("Dizayn Proqramları") && (
              <>
                <SelectMult
                  label={`${questions?.[6]?.question_title}*`}
                  options={questions?.[6]?.answers.slice(0, 3)}
                  register={register("Dizayn Proqramları")}
                  value={formData?.["Dizayn Proqramları"]}
                  trigger={trigger}
                  placeholder="Select Programs"
                  errors={errors?.["Dizayn Proqramları"]}
                />
                {formData?.["Dizayn Proqramları"]?.length > 0 &&
                  formData?.["Dizayn Proqramları"]?.map(
                    (lang: any, index: any) => {
                      const checkError = errors[lang] ? errors[lang] : "";
                      return (
                        <div key={index} className="space-y-2">
                          <label className="pl-2">
                            {lang + " " + questions?.[7]?.question_title}*
                          </label>
                          <div className="flex gap-1">
                            <Radio
                              options={questions?.[7]?.answers}
                              value={watch(lang)}
                              register={register(lang)}
                              trigger={trigger}
                              errors={checkError}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
              </>
            )}
          </div>
        ) : null}
      </div>

      <LinkButton
        nav={{
          state: { stageName: prevStageName, subStageName: prevSubStageName },
          path: { slugName: prevSlugName, subSlugName: prevSubSlugName },
        }}
        type="outline"
        onClick={() => dispatch(addErrorsLength(0))}
        label="Geri"
        className="absolute left-0 -bottom-20"
      />

      <Link to='/report'>
        <button
          type={Object.keys(errors).length > 0 ? "button" : "submit"}
          className={`absolute -bottom-[79px] right-0 w-[180px] flex rounded-full justify-center items-center py-3.5 gap-4 bg-qss-secondary flex-row text-white text-white"}`}
          onClick={() => {
            dispatch(addSelect(true));
          }}
        >
          {/* <LinkButton
          nav={{
            state: { stageName: nextStageName, subStageName: nextSubStageName },
            path: { slugName: slug, subSlugName: nextSubSlugName },
          }}
          haveIcon={false}
          label="Yekunlaşdır"
          className="absolute right-0 -bottom-20"
        /> */}
          Yekunlaşdır
        </button>
      </Link>
    </form>
  );
};

export default ProgramSkills;
