import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import GetStage from "../../../services/GetStage";
import Radio from "../../RadioInput";
import LinkButton from "../../LinkButton";
import { updateStageForm } from "../../../state/stages/stageFormSlice";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { GeneralQuestionsFormProps } from "../Education/GeneralQuestionsForm";
import { Icon } from "@iconify/react";
import SelectMult from "../../SelectMult";
import * as yup from "yup";
import ClockLoader from "react-spinners/ClockLoader";
import { IAnswer, ISelectedValue } from "types";
import { yupResolver } from "@hookform/resolvers/yup";
import { addErrorsLength, addSelect } from "state/dataSlice";
import { useSelector } from "react-redux";
import ButtonSave from "components/ButtonSave";
import { useNavigate } from "react-router-dom";

export type SportFormValues = {
  haveSport: { answer: string; answer_weight: string };
  whichSport: string[];
  sports: [];
  [key: string]: string | any;
};

const schema = yup
  .object({
    haveSport: yup
      .object({
        answer: yup.string().required(),
        answer_weight: yup.string().optional().nullable(),
      })
      .required(),
    whichSport: yup.array().when("haveSport", {
      is: (sport: any) => sport.answer !== "Yoxdur",
      then: () => yup.array().min(1).required(),
    }),
  })
  .required();

type DynamicFields = {
  [fieldName: string]: {
    schema: yup.ObjectSchema<any>;
  };
};

interface RootState {
  dataa: {
    errorsLength: number;
  };
}

const SportForm = ({ stageIndex, subStageSlug }: GeneralQuestionsFormProps) => {
  const { useGetStageQuery, useGetQuestionsQuery } = GetStage()
  const { data: stagesData } = useGetStageQuery();
  const errLengt = useSelector((state: RootState) => state.dataa.errorsLength);
  const { stage_children } = stagesData?.[stageIndex] || {};

  const {
    slug: nextSlugName,
    stage_name: nextStageName,
    stage_children: nextStageChildren,
  } = stagesData?.[stageIndex] || {};

  const {
    slug: nextSlugNameCond,
    stage_name: nextStageNameCond,
    stage_children: nextStageChildrenCond,
  } = stagesData?.[4] || {};

  const {
    slug: prevSlugName,
    stage_name: prevStageName,
    stage_children: prevStageChildren,
  } = stagesData?.[2] || {};

  const { slug: prevSubSlugName, stage_name: prevSubStageName } =
    prevStageChildren?.[1] || {};

  const { slug: subSlugName } = stage_children?.[0] || {};
  const { slug: nextSubSlugName, stage_name: nextSubStageName } =
    nextStageChildren?.[1] || {};
  const { slug: nextSubSlugNameCond, stage_name: nextSubStageNameCond } =
    nextStageChildrenCond?.[0] || {};
  const {
    data: questionsData,
    error: questionsError,
    isLoading,
  } = useGetQuestionsQuery(subSlugName);
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const [dynamicFields, setDynamicFields] = useState<DynamicFields>({});
  const addDynamicField = (fieldName: IAnswer) => {
    setDynamicFields((prevDynamicFields) => ({
      ...prevDynamicFields,
      [fieldName.answer_title]: {
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

  const { formData } =
    (useAppSelector((state) => state.stageForm)?.find(
      ({ name }) => name === subStageSlug
    ) as { formData: SportFormValues & any }) || ({} as any);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SportFormValues | any>({
    resolver: yupResolver(dynamicSchema),
    defaultValues: {
      haveSport: { answer: "", answer_weight: "" },
      whichSport: [],
      sports: [],
    },
  });

  const onSubmit: SubmitHandler<SportFormValues> = async () => {
    const data = await fillSports();
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
          formData: value as SportFormValues,
        })
      );
    });

    reset(formData);

    return () => subscription.unsubscribe();
  }, [subStageSlug, watch]);

  useEffect(() => {
    trigger();
  }, [watch("whichSport"), dynamicFields]);

  useEffect(() => {
    if (formData?.haveSport?.answer === "Yoxdur") {
      dispatch(
        updateStageForm({
          name: nextSubSlugName ? nextSubSlugName : "",
          formData: {
            professionalSports: [],
          },
        })
      );

      reset({
        haveSport: { answer: "Yoxdur", answer_weight: "" },
        whichSport: [],
        sports: [],
      });
    }
  }, [formData?.haveSport?.answer]);

  useEffect(() => {
    if (watch("whichSport")?.length !== 0) {
      setValue("haveSport", { answer: "Var", answer_weight: null });
    } else if (
      watch("whichSport")?.length === 0 &&
      watch("haveSport.answer") === "Var"
    ) {
      setValue("haveSport", { answer: "", answer_weight: null });
    }

    if (formData?.whichSport?.length > 0) {
      setDynamicFields({});
      formData?.whichSport.map((item: IAnswer) => addDynamicField(item));
    }
  }, [formData?.whichSport?.length]);

  if (isLoading)
    return (
      <div className="absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
        <ClockLoader color="#038477" />
      </div>
    );
  if (questionsError) return <div>Error</div>;

  const questions = questionsData?.[0]?.questions;

  const inputProps = [
    { register: register("haveSport") },
    { register: register("whichSport") },
  ];

  // console.log("err", errors);

  const handleRemove = async (item:IAnswer) => {
    setValue(
      "whichSport",
      formData?.whichSport?.filter((el: string) => el !== item.answer_title)
    );

    setValue(`${item}`, undefined);
    removeDynamicField(item);
  };

  const fillSports = () => {
    if (formData?.whichSport?.length > 0) {
      const updatedFormData: any = { ...formData };
      const updatedSports = formData.whichSport.map((item: IAnswer) => {
        if (
          formData[item.answer_title]?.answer === "Peşəkar" ||
          formData[item.answer_title]?.answer === "Həvəskar"
        ) {
          delete updatedFormData[item.answer_title];
          return { name: item.answer_title, value: formData[item.answer_title] };
        }
      });

      reset({
        haveSport: { answer: "Var", answer_weight: "" },
        whichSport: formData?.whichSport || [],
        sports: updatedSports,
      });

      return updatedSports;
    }
  };

  // console.log("formdata", formData);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-7 flex-col flex gap-5"
    >
      <div className="space-y-7 ">
        <div className="space-y-2">
          <label className="pl-2">{questions?.[1]?.question_title}*</label>
          <div className="flex items-center gap-5">
            <div className="w-[70%]">
              <SelectMult
                placeholder="Idman növü"
                options={questions?.[1]?.answers}
                register={inputProps[1].register}
                value={formData?.whichSport}
                errors={errors.whichSport}
              />
            </div>
            <Radio
              options={questions?.[0]?.answers}
              value={formData?.haveSport}
              register={inputProps[0].register}
              errors={errors.haveSport}
              trigger={trigger}
            />
          </div>
        </div>
        <div className="pr-2 max-h-[330px] overflow-y-auto">
          {formData?.whichSport?.length !== 0 && (
            <label>{questions?.[2]?.question_title}</label>
          )}

          {formData?.whichSport?.map((item: IAnswer, index: number) => {
            const SportErr = errors[item.answer_title] ? errors[item.answer_title] : "";

            return (
              <div className="p-2.5 relative flex gap-4 " key={index}>
                <span className="bg-qss-input cursor-pointer relative py-2 max-w-[142px] w-full justify-center items-center flex rounded-full px-4 gap-2">
                  <span>{item.answer_title}</span>
                  <Icon
                    icon="typcn:delete-outline"
                    className="cursor-pointer text-2xl text-[#EE4A4A]/75 hover:text-[#EE4A4A]"
                    onClick={() => handleRemove(item)}
                  />
                </span>
                <Radio
                  options={questions?.[2]?.answers}
                  value={watch(item.answer_title)}
                  register={register(item.answer_title)}
                  errors={SportErr}
                  trigger={trigger}
                />
              </div>
            );
          })}
        </div>
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

      {errLengt !== 0 || Object.keys(errors)?.length !== 0 ? (
        <ButtonSave
          label="Növbəti"
          className="absolute right-0 -bottom-20"
          onClick={() => dispatch(addSelect(true))}
        />
      ) : (
        <ButtonSave label="Növbəti" className="absolute right-0 -bottom-20" />
      )}
    </form>
  );
};

export default SportForm;