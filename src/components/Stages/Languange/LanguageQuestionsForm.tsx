import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { Icon } from "@iconify/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";

import GetStage from "../../../services/GetStage";
import LanguageAdd, { AddLangFormValues } from "./components/LanguageAdd";
import { addRemove, addPop, addSelect, addErrorsLength } from "state/dataSlice";
import { updateStageForm } from "../../../state/stages/stageFormSlice";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { GeneralQuestionsFormProps } from "../Education/GeneralQuestionsForm";

import Radio from "../../RadioInput";
import LinkButton from "../../LinkButton";
import ButtonSave from "components/ButtonSave";

import removeIcon from "../../../assets/Vector.svg";

interface RootState {
  dataa: {
    removeFunc: boolean;
    errorsLength: number;
  };
}
const schema = yup.object({
  languageSkills: yup.array().min(1).required(),
  haveLanguageSkills: yup
    .object({
      answer: yup.string().required(),
      weight: yup.string().optional().nullable(),
    })
    .required(),
});
export type LanguageQuestionsFormValues = yup.InferType<typeof schema>;

const LanguageQuestionsForm = ({
  stageIndex,
  subStageSlug,
}: GeneralQuestionsFormProps) => {
  
  const { useGetStageQuery, useGetQuestionsQuery } = GetStage()
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
  } = stagesData?.[0] || {};

  const { slug: prevSubSlugName, stage_name: prevSubStageName } =
    prevStageChildren?.[stageIndex + 1] || {};

  const { slug: subSlugName } = stage_children?.[0] || {};

  const { slug: nextSubSlugName, stage_name: nextSubStageName } =
    nextStageChildren?.[0] || {};

  const {
    data: questionsData,
    error: questionsError,
    isLoading,
  } = useGetQuestionsQuery(subSlugName);
  const remove = useSelector((state: RootState) => state.dataa.removeFunc);
  const [idd, setId] = useState(0);
  const dispatch = useAppDispatch();

  const { formData } =
    (useAppSelector((state) => state.stageForm)?.find(
      ({ name }) => name === subStageSlug
    ) as { formData: LanguageQuestionsFormValues }) || {};

  const {
    register,
    handleSubmit,
    watch,
    reset: ParentReset,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<LanguageQuestionsFormValues>({
    resolver: yupResolver<LanguageQuestionsFormValues>(schema),
    defaultValues: {
      languageSkills: [],
      haveLanguageSkills: { answer: "", weight: "" },
    },
  });

  const onSubmit: SubmitHandler<LanguageQuestionsFormValues> = (data) => {};

  const errLength = useSelector((state: RootState) => state.dataa.errorsLength);
  const questions = questionsData?.[0]?.questions;

  const [isAdding, setIsAdding] = useState(true);
  const [isEditing, setIsEditing] = useState<{
    edit: boolean;
    data?: AddLangFormValues;
  }>({ edit: false });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [chooseLang, setChooseLang] = useState(true);

  const handleAdd = (lang: LanguageQuestionsFormValues) => {
    const data = formData?.languageSkills;
    setValue("languageSkills", [...data, lang]);
    setIsAdding(false);
  };

  const handleRemove = (landIndex: number) => {
    dispatch(addPop(true));
    setId(landIndex);
  };

  if (remove === true) {
    const filterData = formData?.languageSkills?.filter(
      (_, index) => index !== idd
    );
    formData?.languageSkills.length === 1 && setIsAdding(true);
    setValue("haveLanguageSkills", { answer: "", weight: "" });
    setValue("languageSkills", filterData);
    dispatch(addRemove(false));
  }

  const handleEdit = (langIndex: number) => {
    const data = formData?.languageSkills?.[langIndex] as AddLangFormValues;
    setEditingIndex(langIndex);
    setIsEditing({ edit: true, data });
  };

  const editLang = (editLangData: AddLangFormValues) => {
    const data = formData?.languageSkills;
    const editedData = data?.map((lang: AddLangFormValues, index: number) => {
      if (index === editingIndex) {
        return editLangData;
      }
      return lang;
    });

    setValue("languageSkills", editedData);
    setIsEditing({ edit: false });
    setEditingIndex(null);
  };

  useEffect(() => {
    const subscription = watch((value) => {
      dispatch(
        updateStageForm({
          name: subStageSlug,
          formData: value as LanguageQuestionsFormValues,
        })
      );
    });

    ParentReset(formData);

    return () => subscription.unsubscribe();
  }, [subStageSlug, watch]);

  if (isLoading)
    return (
      <div className="absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
        <ClockLoader color="#038477" />
      </div>
    );
  if (questionsError) return <div>Error</div>;

  // console.log(errLength);
  // console.log(errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 flex-col flex gap-5 h-[460px] overflow-y-auto overflow-hidden"
    >
      {isAdding ? (
        <>
          <h3 className="pl-2">{questions?.[1].question_title}</h3>
          <div className="flex items-center relative">
            <LanguageAdd
              data={questions}
              addLang={handleAdd}
              setChooseLang={setChooseLang}
              isAdding={isAdding}
              setIsAdding={setIsAdding}
              formData={formData}
              parentReset={ParentReset}
            />
            {formData?.languageSkills?.length === 0 && (
              <div className="">
                <div className="flex gap-5 w-48 py-2 px-4">
                  <Radio
                    value={watch("haveLanguageSkills")}
                    register={register("haveLanguageSkills")}
                    options={questions?.[0].answers}
                    errors={errors.haveLanguageSkills}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      ) : isEditing.edit ? (
        <LanguageAdd
          data={questions}
          addLang={handleAdd}
          editData={isEditing?.data}
          editLang={editLang}
          setChooseLang={setChooseLang}
          setIsEditing={setIsEditing}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <h3 className="pl-2">Əlavə xarici dil biliklərinizi qeyd edin</h3>
            <button
              className="add py-2 px-4 w-full h-12 rounded-2xl flex justify-evenly items-center"
              type="button"
              onClick={() => {
                setIsAdding(true), dispatch(addSelect(false));
              }}
            >
              Əlavə et +
            </button>
            <div className="titles flex px-16 justify-start gap-16">
              <span>Dil</span>
              <span>Səviyyə</span>
              <span>Sertifikat</span>
            </div>
          </div>
          <ul>
            {formData?.languageSkills?.map(
              (lang: AddLangFormValues, index: number) => (
                <li
                  key={index}
                  className="border flex-grow rounded-full flex justify-between items-center m-2 relative min-h-[46px] background"
                >
                  <div className="w-36 rounded-l-full flex items-center">
                    <div className="info flex gap-5 p-2.5 ">
                      <span>{index + 1}. </span>
                      <span> {lang.language?.answer}</span>
                    </div>
                  </div>
                  <div className="border-r">
                    <div className="level p-2.5">
                      {lang.langLevel?.answer?.substring(0, 2)}
                    </div>
                  </div>
                  <div className="w-48">
                    <div className="certificate py-2.5 px-1.5">
                      {lang.langCertName && lang.langCertResult && (
                        <>
                          <span>{lang.langCertName}</span>{" "}
                          <span> {lang.langCertResult}</span>{" "}
                        </>
                      )}
                      {lang.engLangCert?.answer === "İELTS" && (
                        <p className="w-48">
                          IELTS {lang.engCertResult?.answer}
                        </p>
                      )}
                      {lang.engLangCert?.answer === "TOEFL" && (
                        <p className="w-48">
                          TOEFL {lang.engCertResult?.answer}
                        </p>
                      )}
                      {(lang.langCert?.answer === "1" ||
                        lang.engLangCert?.answer === "Yoxdur" ||
                        lang.langCert?.answer === "Xeyr") && (
                        <span>Sertifikat yoxdur </span>
                      )}
                    </div>
                  </div>
                  <div className="rounded-r-full">
                    <div className="settings flex justify-around p-2.5 gap-2 w-20 h-full items-center">
                      <div className="edit" onClick={() => handleEdit(index)}>
                        <Icon
                          icon="fluent:pen-16-regular"
                          className="cursor-pointer text-2xl text-[#ADADAD] hover:text-gray-600"
                        />
                      </div>
                      <div className="remove cursor-pointer">
                        <img
                          src={removeIcon}
                          alt="remove"
                          onClick={() => {
                            handleRemove(index);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              )
            )}
          </ul>
        </>
      )}
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
      {watch("haveLanguageSkills.answer") === "Yoxdur" ||
      formData?.languageSkills.length > 0 ? (
        <LinkButton
          onClick={() => dispatch(addSelect(false))}
          nav={{
            state: { stageName: nextStageName, subStageName: nextSubStageName },
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

export default LanguageQuestionsForm;