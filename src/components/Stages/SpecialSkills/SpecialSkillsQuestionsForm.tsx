import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import GetStage from "../../../services/GetStage";
import Radio from "../../RadioInput";
import LinkButton from "../../LinkButton";
import { updateStageForm } from "../../../state/stages/stageFormSlice";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { GeneralQuestionsFormProps } from "../Education/GeneralQuestionsForm";
import SelectMult from "components/SelectMult";
import { XCircleIcon } from "@heroicons/react/24/outline";
import ClockLoader from "react-spinners/ClockLoader";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ButtonSave from "components/ButtonSave";
import { addErrorsLength, addSelect } from "state/dataSlice";
import { useNavigate } from "react-router-dom";
import { IAnswer } from "types";


export type SpecialSkillsFormValues = {
  haveSpecialSkills: { answer: string; weight: string };
  specialSkills: any[];
  skills: [];
  [key: string]: string | any;
};const schema = yup.object().shape({
  haveSpecialSkills: yup
    .object({
      answer: yup.string().required(),
      weight: yup.string().optional().nullable(),
    })
    .required(),
  specialSkills: yup.array().when("haveSpecialSkills", {
    is: (haveSpecialSkills: any) => haveSpecialSkills.answer !== "Yoxdur",
    then: () => yup.array().min(1).required(),
  }),

  skills: yup.array().when("haveSpecialSkills", {
    is: (haveSpecialSkills: any) => haveSpecialSkills.answer !== "Yoxdur",
    then: () =>
      yup
        .array()
        .of(
          yup.object().shape({
            name: yup.string().required(),
            value: yup.object().shape({
              answer: yup.string().required(),
              weight: yup.string().optional().nullable(),
            }),
          })
        )
        .required(),
  }),
});

type DynamicFields = {
  [fieldName: string]: {
    schema: yup.ObjectSchema<any>;
  };
};
const SpecialSkillsForm = ({
  stageIndex,
  subStageSlug,
}: GeneralQuestionsFormProps) => {
  
  const { useGetStageQuery, useGetQuestionsQuery } = GetStage()
  const { data: stagesData } = useGetStageQuery();
  const { stage_children } = stagesData?.[stageIndex] || {};

  const { formData } =
    (useAppSelector((state) => state.stageForm)?.find(
      ({ name }) => name === subStageSlug
    ) as { formData: SpecialSkillsFormValues }) || {};

  const {
    slug: nextSlugName,
    stage_name: nextStageName,
    stage_children: nextStageChildren,
  } = stagesData?.[stageIndex] || {};

  const {
    slug: nextSlugNameCond,
    stage_name: nextStageNameCond,
    stage_children: nextStageChildrenCond,
  } = stagesData?.[3] || {};

  const { slug: nextSubSlugNameCond, stage_name: nextSubStageNameCond } =
    nextStageChildrenCond?.[0] || {};

  console.log(nextSubSlugNameCond, nextSubStageNameCond);

  const {
    slug: prevSlugName,
    stage_name: prevStageName,
    stage_children: prevStageChildren,
  } = stagesData?.[1] || {};

  const { slug: prevSubSlugName, stage_name: prevSubStageName } =
    prevStageChildren?.[0] || {};

  const { slug: subSlugName } = stage_children?.[0] || {};

  const { slug: nextSubSlugName, stage_name: nextSubStageName } =
    nextStageChildren?.[1] || {};

  const {
    data: questionsData,
    error: questionsError,
    isLoading,
  } = useGetQuestionsQuery(subSlugName);

  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const questions = questionsData?.[0]?.questions;

  const [dynamicFields, setDynamicFields] = useState<DynamicFields>({});

  const addDynamicField = (fieldName: IAnswer) => {
    setDynamicFields((prevDynamicFields) => ({
      ...prevDynamicFields,
      [fieldName.answer_title]: {
        schema: yup
          .object()
          .shape({
            answer: yup.string().required(),
            weight: yup.string().optional().nullable(),
          })
          .required(`${fieldName} is required`),
      },
    }));
  };

  const removeDynamicField = (fieldName: IAnswer) => {
    setDynamicFields((prevDynamicFields) => {
      const updatedFields = { ...prevDynamicFields };
      delete updatedFields[fieldName.answer_title];
      return updatedFields;
    });
  };

  const dynamicSchema = yup.object().shape({
    ...schema.fields,
    ...Object.fromEntries(
      Object.entries(dynamicFields).map(([fieldName, field]) => [
        fieldName,
        field.schema,
      ])
    ),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<SpecialSkillsFormValues | any>({
    resolver: yupResolver(dynamicSchema),
    defaultValues: {
      haveSpecialSkills: { answer: "", weight: "" },
      specialSkills: [],
      skills: [],
    },
  });

  const onSubmit: SubmitHandler<SpecialSkillsFormValues> = async () => {
    const data = await fillSkills();
    dispatch(addSelect(false));

    const isProExist = data?.some((i: any) => "Peşəkar" === i?.value?.answer);

    const nextSlug = isProExist ? nextSlugName : nextSlugNameCond;
    const nextSubSlug = isProExist ? nextSubSlugName : nextSubSlugNameCond;
    const nextStage = isProExist ? nextStageName : nextStageNameCond;
    const nextSubStage = isProExist ? nextSubStageName : nextSubStageNameCond;

    nav(`/profile/stages/${nextSlug}/${nextSubSlug}`, {
      state: {
        subStageName: nextSubStage,
        stageName: nextStage,
      },
    });
  };

  useEffect(() => {
    const subscription = watch((value) => {
      trigger();
      dispatch(
        updateStageForm({
          name: subStageSlug,
          formData: value as SpecialSkillsFormValues,
        })
      );
    });
    reset(formData);
    return () => subscription.unsubscribe();
  }, [subStageSlug, watch]);

  useEffect(() => {
    trigger();
  }, [watch("specialSkills"), dynamicFields]);

  useEffect(() => {
    if (formData?.haveSpecialSkills?.answer === "Yoxdur") {
      dispatch(
        updateStageForm({
          name: nextSubSlugName ? nextSubSlugName : "",
          formData: {
            certificates: [],
          },
        })
      );

      reset({
        haveSpecialSkills: { answer: "Yoxdur", weight: null },
        specialSkills: [],
        skills: [],
      });
    }
  }, [formData?.haveSpecialSkills?.answer]);

  useEffect(() => {
    if (formData?.specialSkills?.length === 1) {
      setValue("haveSpecialSkills", { answer: "Var", weight: null });
    } else if (
      formData?.specialSkills?.length === 0 &&
      formData.haveSpecialSkills.answer === "Var"
    ) {
      setValue("haveSpecialSkills", { answer: "", weight: null });
    }

    setDynamicFields({});
    if (formData?.specialSkills?.length > 0) {
      formData?.specialSkills.map((item) => addDynamicField(item));
    }
  }, [formData?.specialSkills?.length]);

  if (isLoading)
    return (
      <div className="absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
        <ClockLoader color="#038477" />
      </div>
    );
  if (questionsError) return <div>Error</div>;

  const inputProps = [
    { register: register("haveSpecialSkills") },
    { register: register("specialSkills") },
  ];

  const fillSkills = () => {
    if (formData?.specialSkills?.length > 0) {
      const updatedFormData: any = { ...formData };
      const updatedSkills = formData.specialSkills.map((item: IAnswer) => {
        if (
          formData[item.answer_title]?.answer === "Peşəkar" ||
          formData[item.answer_title]?.answer === "Həvəskar"
        ) {
          delete updatedFormData[item.answer_title];
          return { name: item.answer_title, value: formData[item.answer_title] };
        }
      });

      reset({
        haveSpecialSkills: { answer: "Var", weight: null },
        specialSkills: formData?.specialSkills || [],
        skills: updatedSkills,
      });

      return updatedSkills;
    }
  };

  console.log("formdata", formData);
  console.log("er", errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-7 flex-col flex gap-5"
    >
      <div className="space-y-7">
        <div className="space-y-2">
          <label className="pl-2">{questions?.[1]?.question_title}*</label>
          <div className="flex gap-5">
            <div className="w-[70%]">
              <SelectMult
                value={formData?.specialSkills}
                options={questions?.[1]?.answers}
                register={inputProps[1].register}
                placeholder={"Xüsusi bacarığını seç"}
                trigger={trigger}
                errors={errors.specialSkills}
              />
            </div>
            {
              <Radio
                options={questions?.[0]?.answers}
                value={formData?.haveSpecialSkills}
                register={inputProps[0].register}
                errors={errors.haveSpecialSkills}
                trigger={trigger}
              />
            }
          </div>
        </div>

        <>
          {formData?.specialSkills?.length > 0 ? (
            <div className="space-y-2 animate-fade-in">
              <label className="pl-2">{questions?.[2]?.question_title}*</label>
              <div className="flex gap-5 flex-col">
                {formData?.specialSkills?.map((item : IAnswer, idx) => {
                  const skillErr = errors[item.answer_title] ? errors[item.answer_title] : "";

                  return (
                    <div
                      key={idx}
                      className="flex justify-between animate-fade-in w-full gap-4"
                    >
                      <div className="py-2 px-2 gap-1 rounded-full whitespace-nowrap bg-qss-input flex justify-center items-center w-64">
                        <span className="w-3/4 flex justify-center">
                          {item.answer_title}
                        </span>
                        <XCircleIcon
                          onClick={() => {
                            setValue(
                              "specialSkills",
                              formData?.specialSkills?.filter(
                                (specialSkill) => specialSkill !== item.answer_title
                              )
                            );
                            setValue(`${item.answer_title}`, undefined);
                            removeDynamicField(item);
                          }}
                          className="w-5 h-5 text-red-400 cursor-pointer"
                        />
                      </div>
                      <div className="flex  w-full justify-between">
                        <Radio
                          options={questions?.[2]?.answers}
                          value={watch(item.answer_title)}
                          register={register(item.answer_title)}
                          errors={skillErr}
                          trigger={trigger}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </>
      </div>
      {watch("haveSpecialSkills.answer") === "Yoxdur" ? (
        <LinkButton
          nav={{
            state: {
              stageName: nextStageNameCond,
              subStageName: nextSubStageNameCond,
            },
            path: {
              slugName: nextSlugNameCond,
              subSlugName: nextSubSlugNameCond,
            },
          }}
          label="Növbəti"
          className="absolute right-0 -bottom-20"
        />
      ) : Object.keys(errors).length !== 0 ? (
        <ButtonSave
          trigger={trigger}
          className="absolute right-0 -bottom-20"
          label="Növbəti"
          onClick={() => dispatch(addSelect(true))}
        />
      ) : (
        <ButtonSave label="Növbəti" className="absolute right-0 -bottom-20" />
      )}

      <LinkButton
        nav={{
          state: { stageName: prevStageName, subStageName: prevSubStageName },
          path: { slugName: prevSlugName, subSlugName: prevSubSlugName },
        }}
        onClick={() => dispatch(addErrorsLength(0))}
        type="outline"
        label="Geri"
        className="absolute left-0 -bottom-20"
      />
    </form>
  );
};

export default SpecialSkillsForm;