import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ClockLoader from "react-spinners/ClockLoader";
import * as yup from "yup";
import GetStage from "../../../services/GetStage";
import { updateStageForm } from "../../../state/stages/stageFormSlice";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { addSelect, addTehsil } from "state/dataSlice";

import Select from "../../Select";
import LinkButton from "../../LinkButton";
import ButtonSave from "components/ButtonSave";
const { useGetStageQuery, useGetQuestionsQuery } = GetStage()
const schema = yup
  .object({
    curOccupation: yup
      .object({
        answer: yup.string().required(),
        answer_weight: yup.string().required(),
      })
      .required(),
    education: yup
      .object({
        answer: yup.string().required(),
        answer_weight: yup.string().required(),
      })
      .required(),
    educationGrant: yup
      .object({
        answer: yup.string().required(),
        answer_weight: yup.string().required(),
      })
      .required(),
  })
  .required();

export type GeneralQuestionsFormValues = yup.InferType<typeof schema>;

export type GeneralQuestionsFormProps = {
  subStageSlug: string;
  stageIndex: any;
  num: number;
};

const GeneralQuestionsForm = ({
  stageIndex,
  subStageSlug,
  num,
}: GeneralQuestionsFormProps) => {
  const { data: stagesData } = useGetStageQuery();

  const {
    slug: slugName,
    stage_name: stageName,
    stage_children,
  } = stagesData?.[0] || {};

  const { slug: subSlugName, stage_name: subStageName } =
    stage_children?.[stageIndex + 1] || {};

  const {
    data: questionsData,
    error: questionsError,
    isLoading,
  } = useGetQuestionsQuery(subStageSlug);

  const dispatch = useAppDispatch();
  const questions = questionsData?.[0]?.questions;

  const { formData } =
    (useAppSelector((state) => state.stageForm)?.find(
      ({ name }) => name === subStageSlug
    ) as { formData: GeneralQuestionsFormValues }) || {};

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    trigger,
  } = useForm<GeneralQuestionsFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      curOccupation: { answer: "", answer_weight: "" },
      education: { answer: "", answer_weight: "" },
      educationGrant: { answer: "", answer_weight: "" },
    },
  });

  const onSubmit: SubmitHandler<GeneralQuestionsFormValues> = (data) => {};

  useEffect(() => {
    const subscription = watch((value) => {
      trigger();
      dispatch(addTehsil(value.education?.answer));
      dispatch(
        updateStageForm({
          name: subStageSlug,
          formData: value as GeneralQuestionsFormValues,
        })
      );
    });

    reset(formData);
    return () => subscription.unsubscribe();
  }, [subStageSlug, watch]);

  if (isLoading)
    return (
      <div className="absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
        <ClockLoader color="#038477" />
      </div>
    );

  if (questionsError) return <div>Error</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 flex-col flex gap-5"
    >
      <Select
        label={`${questions?.[0]?.question_title}*`}
        options={questions?.[0]?.answers}
        register={register("curOccupation")}
        value={formData?.curOccupation}
        errors={errors.curOccupation}
        trigger={trigger}
        name="curOccupation"
      />

      <Select
        label={`${questions?.[1]?.question_title}*`}
        options={questions?.[1]?.answers}
        register={register("education")}
        value={formData?.education}
        errors={errors.education}
        trigger={trigger}
        name="education"
      />

      <Select
        label={`${questions?.[2]?.question_title}*`}
        options={questions?.[2]?.answers}
        register={register("educationGrant")}
        value={formData?.educationGrant}
        errors={errors.educationGrant}
        trigger={trigger}
        name="educationGrant"
      />

      {Object.keys(errors).length === 0 ? (
        <LinkButton
          onClick={() => dispatch(addSelect(false))}
          nav={{
            state: { stageName, subStageName },
            path: { slugName, subSlugName },
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

export default GeneralQuestionsForm;