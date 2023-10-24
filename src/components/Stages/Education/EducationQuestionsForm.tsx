import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import GetStage from "../../../services/GetStage";
import LinkButton from "../../LinkButton";
import { updateStageForm } from "../../../state/stages/stageFormSlice";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { useSelector } from "react-redux";
import {
  GeneralQuestionsFormProps,
  GeneralQuestionsFormValues,
} from "./GeneralQuestionsForm";
import ClockLoader from "react-spinners/ClockLoader";
import * as yup from "yup";
import FormEducations, { AddEduFormValues } from "./components/FormEducations";
import Educations from "./components/Educations";
import { addErrorsLength, addSelect } from "state/dataSlice";
import ButtonSave from "components/ButtonSave";

const schema = yup.object({
  education: yup.array().min(1).required(),
});

interface RootState {
  dataa: {
    currentPage: 1;
    tehsil: string;
    errorsLength: number;
  };
}

export type EducationQuestionsFormValues = yup.InferType<typeof schema>;

const EducationQuestionsForm = ({
  subStageSlug,
  stageIndex,
}: GeneralQuestionsFormProps) => {
  const { useGetStageQuery, useGetQuestionsQuery } = GetStage()
  const { data: stagesData } = useGetStageQuery();

  console.log();
  
  const nav = useNavigate();
  const page = useSelector((state: RootState) => state.dataa.currentPage);
  const tehsil = useSelector((state: RootState) => state.dataa.tehsil);
  const { state } = useLocation();

  const {
    slug: slugName,
    stage_name: stageName,
    stage_children,
  } = stagesData?.[stageIndex] || {};

  const { slug: subSlugName, stage_name: subStageName } =
    stage_children?.[stageIndex + 2] || {};

  const { slug: prevSubSlugName, stage_name: prevSubStageName } =
    stage_children?.[stageIndex] || {};

  const dispatch = useAppDispatch();
  const { education } =
    (useAppSelector((state) => state.stageForm)?.find(
      ({ name }) => name === prevSubSlugName
    )?.formData as GeneralQuestionsFormValues) || {};

  const { formData } =
    (useAppSelector((state) => state.stageForm)?.find(
      ({ name }) => name === subStageSlug
    ) as { formData: EducationQuestionsFormValues }) || {};

    
  const {
    data: questionsData,
    error: questionsError,
    isLoading,
  } = useGetQuestionsQuery(subStageSlug);

  
  const {
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
  } = useForm<EducationQuestionsFormValues>({
    resolver: yupResolver<EducationQuestionsFormValues>(schema),
    defaultValues: {
      education: [],
    },
  });

  const onSubmit: SubmitHandler<EducationQuestionsFormValues> = (data) => {};

  const questions = questionsData?.[0]?.questions;

  useEffect(() => {
    const subscription = watch((value) => {
      dispatch(
        updateStageForm({
          name: subStageSlug,
          formData: value as EducationQuestionsFormValues,
        })
      );
      if (tehsil === "Orta təhsil") {
        state.subStageName === "Olimpiada sualları"
          ? nav(`/profile/stages/${slugName}/${prevSubSlugName}`, {
              state: { subStageName: prevSubStageName, stageName: stageName },
            })
          : nav(`/profile/stages/${slugName}/${subSlugName}`, {
              state: { subStageName: subStageName, stageName: stageName },
            });
      }
    });

    if (tehsil === "Orta təhsil") {
      reset();
    } else {
      reset(formData);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [subStageSlug, watch]);

  if (isLoading)
    return (
      <div className="absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
        <ClockLoader color="#038477" />
      </div>
    );

  if (questionsError) return <div>Error</div>;

  const handleAddEdu = (eduData: AddEduFormValues) => {
    const data = formData?.education;
    setValue("education", [...data, eduData]);
    // setIsAdding(false);
  };

  console.log(errors);
  console.log("formData", formData);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-7 flex-col flex gap-5"
      noValidate
    >
      <div className="space-y-7">
        {page === 1 || formData?.education.length === 0 ? (
          <div className="h-[460px] overflow-y-scroll">
            <FormEducations
              questions={questions}
              formData={formData}
              handleAddEdu={handleAddEdu}
              name={tehsil}
            />
          </div>
        ) : (
          <Educations formData={formData} setValue={setValue} />
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

      {formData?.education?.length > 0 ? (
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

export default EducationQuestionsForm;