import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import GetStage from "../../../services/GetStage";
import Select from "../../Select";
import LinkButton from "../../LinkButton";
import { updateStageForm } from "../../../state/stages/stageFormSlice";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { GeneralQuestionsFormProps } from "./GeneralQuestionsForm";
import { ISelectedValue } from "types";
import ClockLoader from "react-spinners/ClockLoader";
import RadioInput from "../../RadioInput";
import { addErrorsLength, addSelect } from "state/dataSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonSave from "components/ButtonSave";
export type OlympiadQuestionsFormValues = {
  wonOlympics: ISelectedValue;
  subjectOlympiad: ISelectedValue;
  highestOlympiad: ISelectedValue;
  rankOlympiad: ISelectedValue;
};

const schema = yup.object().shape({
  wonOlympics: yup
    .object()
    .shape({
      answer: yup.string().required("This field is required"),
      answer_weight: yup.string().optional().nullable(),
    })
    .required(),

  subjectOlympiad: yup
    .object()
    .shape({
      answer: yup.string().required("This field is required"),
      answer_weight: yup.string().optional().nullable(),
    })
    .required(),

  highestOlympiad: yup
    .object()
    .shape({
      answer: yup.string().required("This field is required"),
      answer_weight: yup.string().required(),
    })
    .required(),

  rankOlympiad: yup
    .object()
    .shape({
      answer: yup.string().required("This field is required"),
      answer_weight: yup.string().required(),
    })
    .required(),
});

const OlympiadQuestionsForm = ({
  stageIndex,
  subStageSlug,
}: GeneralQuestionsFormProps) => {
  const { useGetStageQuery, useGetQuestionsQuery } = GetStage()
  const { data: stagesData } = useGetStageQuery();

  const {
    slug: slugName,
    stage_name: stageName,
    stage_children,
  } = stagesData?.[stageIndex] || {};

  const {
    slug: nextSlugName,
    stage_name: nextStageName,
    stage_children: nextStageChildren,
  } = stagesData?.[stageIndex + 1] || {};

  const { slug: prevSubSlugName } = stage_children?.[stageIndex + 1] || {};

  const { slug: subSlugName, stage_name: subStageName } =
    stage_children?.[stageIndex + 2] || {};

  const { slug: nextSubSlugName } = nextStageChildren?.[stageIndex] || {};

  const {
    data: questionsData,
    error: questionsError,
    isLoading,
  } = useGetQuestionsQuery(subSlugName);

  const dispatch = useAppDispatch();
  const questions = questionsData?.[0]?.questions;

  const { formData } =
    (useAppSelector((state) => state.stageForm)?.find(
      ({ name }) => name === subStageSlug
    ) as { formData: OlympiadQuestionsFormValues }) || {};

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    trigger,
  } = useForm<OlympiadQuestionsFormValues>({
    resolver: yupResolver<OlympiadQuestionsFormValues>(schema),
    defaultValues: {
      wonOlympics: { answer: "", answer_weight: "" },
      subjectOlympiad: { answer: "", answer_weight: "" },
      highestOlympiad: { answer: "", answer_weight: "" },
      rankOlympiad: { answer: "", answer_weight: "" },
    },
  });

  const onSubmit: SubmitHandler<OlympiadQuestionsFormValues> = (data) => {}
    // console.log(data);

  useEffect(() => {
    const subscription = watch((value) => {
      // console.log(value);
      trigger();
      dispatch(
        updateStageForm({
          name: subStageSlug,
          formData: value as OlympiadQuestionsFormValues,
        })
      );
    });

    reset(formData);

    return () => subscription.unsubscribe();
  }, [subStageSlug, watch]);

  useEffect(() => {
    if (formData?.wonOlympics?.answer === "Xeyr") {
      reset({
        wonOlympics: { answer: "Xeyr", answer_weight: null },
      });
    }
  }, [formData?.wonOlympics?.answer]);

  if (isLoading)
    return (
      <div className="absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
        <ClockLoader color="#038477" />
      </div>
    );

  if (questionsError) return <div>Error</div>;

  const inputProps = [
    { register: register("wonOlympics") },
    { register: register("subjectOlympiad") },
    { register: register("highestOlympiad") },
    { register: register("rankOlympiad") },
  ];

  // console.log("formdata", formData);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-7 flex-col flex gap-5"
    >
      <div className="space-y-7">
        <div className="space-y-2">
          <RadioInput
            label={questions?.[0]?.question_title}
            options={questions?.[0]?.answers}
            register={inputProps[0]?.register}
            value={formData?.wonOlympics}
            errors={errors.wonOlympics}
            trigger={trigger}
          />
        </div>
        {formData?.wonOlympics?.answer?.includes("Bəli") && (
          <>
            <Select
              label={`${questions?.[1]?.question_title}*`}
              options={questions?.[1]?.answers}
              register={inputProps[1].register}
              value={formData?.subjectOlympiad}
              errors={errors.subjectOlympiad}
              trigger={trigger}
              name="subjectOlympiad"
            />

            <Select
              label={`${questions?.[2]?.question_title}*`}
              options={questions?.[2]?.answers}
              register={inputProps[2].register}
              value={formData?.highestOlympiad}
              errors={errors.highestOlympiad}
              trigger={trigger}
              name="highestOlympiad"
            />

            <Select
              label={`${questions?.[3]?.question_title}*`}
              options={questions?.[3]?.answers}
              register={inputProps[3].register}
              value={formData?.rankOlympiad}
              errors={errors.rankOlympiad}
              trigger={trigger}
              name="rankOlympiad"
            />
          </>
        )}
      </div>

      <LinkButton
        nav={{
          state: { stageName, subStageName },
          path: { slugName, subSlugName: prevSubSlugName },
        }}
        onClick={() => dispatch(addErrorsLength(0))}
        type="outline"
        label="Geri"
        className="absolute left-0 -bottom-20"
      />

      {Object.keys(errors).length === 0 ||
      formData?.wonOlympics?.answer?.includes("Xeyr") ? (
        <LinkButton
          onClick={() => dispatch(addSelect(false))}
          nav={{
            state: { stageName: nextStageName, subStageName: nextSubSlugName },
            path: { slugName: nextSlugName, subSlugName: nextSubSlugName },
          }}
          label="Növbəti"
          className="absolute right-0 -bottom-20"
        />
      ) : (
        <ButtonSave
          trigger={trigger}
          label="Növbəti"
          className="absolute right-0 -bottom-20"
          onClick={() => dispatch(addSelect(true))}
        />
      )}
    </form>
  );
};

export default OlympiadQuestionsForm;