import { useEffect, useState } from "react";
import GetStage from "services/GetStage";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { updateStageForm } from "state/stages/stageFormSlice";
import { SportFormValues } from "./SportQuestionsForm";
import { GeneralQuestionsFormProps } from "../Education/GeneralQuestionsForm";
import { SubmitHandler, useForm } from "react-hook-form";
import LinkButton from "components/LinkButton";
import { addErrorsLength, addSelect } from "state/dataSlice";
import { useSelector } from "react-redux";
import ButtonSave from "components/ButtonSave";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ISelectedValue } from "types";
import { ClockLoader } from "react-spinners";
import Select from "components/Select";

interface RootState {
  dataa: {
    errorsLength: number;
  };
}

type DynamicFields = {
  [fieldName: string]: {
    schema: yup.ObjectSchema<any>;
  };
};

const schema = yup.object({});

type SportProps = {
  name: string;
  value: ISelectedValue;
};

const ProLevelList = ({
  stageIndex,
  subStageSlug,
}: GeneralQuestionsFormProps) => {
  
  const { useGetStageQuery, useGetQuestionsQuery } = GetStage()
  const { data: stagesData } = useGetStageQuery();
  const errLengt = useSelector((state: RootState) => state.dataa.errorsLength);
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
  } = stagesData?.[3] || {};

  const { slug: prevSubSlugName, stage_name: prevSubStageName } =
    prevStageChildren?.[0] || {};

  const { slug: subSlugName } = stage_children?.[1] || {};
  const { slug: nextSubSlugName, stage_name: nextSubStageName } =
    nextStageChildren?.[0] || {};
  const {
    data: questionsData,
    error: questionsError,
    isLoading,
  } = useGetQuestionsQuery(subSlugName);

  const dispatch = useAppDispatch();
  const questions = questionsData?.[0]?.questions;

  const [dynamicFields, setDynamicFields] = useState<DynamicFields>({});

  const addDynamicField = (fieldName: string) => {
    setDynamicFields((prevDynamicFields: DynamicFields) => ({
      ...prevDynamicFields,
      [fieldName]: {
        schema: yup.object().required(`${fieldName} is required`),
      },
    }));
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
    ) as { formData: any }) || {};

  const { formData: SportFormData } =
    (useAppSelector((state) => state.stageForm)?.find(
      ({ name }) => name === prevSubSlugName
    ) as { formData: SportFormValues & any }) || ({} as any);

  const {
    register,
    trigger,
    formState: { errors },
    watch,
    reset,
    handleSubmit,
  } = useForm<SportFormValues | any>({
    resolver: yupResolver(dynamicSchema),
    defaultValues: {
      professionalSports: [],
    },
  });

  const onSubmit: SubmitHandler<SportFormValues> = (data) => {};

  useEffect(() => {
    if (dynamicFields) {
      trigger();
    }
  }, [dynamicFields]);

  useEffect(() => {
    const subscription = watch((value) => {
      setDynamicFields({});
      SportFormData?.sports?.map((sport: SportProps) => {
        if (sport?.value?.answer === "Peşəkar") {
          addDynamicField(sport?.name + "score");
          addDynamicField(sport?.name + "place");
          trigger();
        }
      });

      dispatch(
        updateStageForm({
          name: subStageSlug,
          formData: value  as any,
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

  const proSports = (SportFormData?.sports || []).filter(
    (sport: SportProps) => sport?.value?.answer === "Peşəkar"
  );

  const fillSports = () => {
    if (proSports?.length > 0) {
      const updatedFormData: any = { ...formData };
      const updatedSports = proSports.map((sport: SportProps) => {
        delete updatedFormData[sport?.name + "score"];
        delete updatedFormData[sport?.name + "place"];
        return {
          name: sport?.name,
          value: {
            whichScore: formData[sport?.name + "score"],
            whichPlace: formData[sport?.name + "place"],
          },
        };
      });

      reset({
        professionalSports: updatedSports,
      });
      return updatedSports;
    }
  };
  console.log("form", formData);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-7 flex-col flex gap-5 h-[400px] overflow-y-auto pr-5"
    >
      {proSports?.length !== 0 &&
        proSports.map((item: any, index: number) => {
          return (
            <div
              className=" border rounded-xl border-[#D8D8D8] p-2.5 mb-5 relative"
              key={index}
            >
              <div className="flex justify-between">
                <label>
                  <span className="text-qss-secondary font-semibold me-1">
                    {item?.name}
                  </span>
                  {questions?.[0]?.question_title}
                </label>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Select
                    label={``}
                    options={questions?.[0]?.answers.slice(0, 4)}
                    register={register(`${item?.name}score`)}
                    value={watch(`${item?.name}score`)}
                    errors={errors[`${item?.name}score`]}
                  />
                </div>
                <div className="col-span-1 ">
                  <Select
                    label={``}
                    options={questions?.[0]?.answers.slice(4, 8)}
                    register={register(`${item?.name}place`)}
                    value={watch(`${item?.name}place`)}
                    errors={errors[`${item?.name}place`]}
                  />
                </div>
              </div>
            </div>
          );
        })}

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
      {Object.keys(errors).length > 0 ? (
        <ButtonSave
          label="Növbəti"
          className="absolute right-0 -bottom-20"
          onClick={() => dispatch(addSelect(true))}
        />
      ) : (
        <LinkButton
          nav={{
            state: { stageName: nextStageName, subStageName: nextSubStageName },
            path: { slugName: nextSlugName, subSlugName: nextSubSlugName },
          }}
          label="Növbəti"
          onClick={() => {
            fillSports();
            dispatch(addSelect(false));
          }}
          className="absolute right-0 -bottom-20"
        />
      )}
    </form>
  );
};

export default ProLevelList;
