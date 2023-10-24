import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "redux";

import { Icon } from "@iconify/react";
import {
  addData,
  addElave,
  addPop,
  addRemove,
  addSelect,
  changeTehsilPage,
} from "state/dataSlice";
import { EducationQuestionsFormValues } from "../EducationQuestionsForm";

interface Edu {
  formData: EducationQuestionsFormValues;
  setValue: any;
}

interface RootState {
  dataa: {
    removeFunc: boolean;
  };
}

const Educations = ({ formData, setValue }: Edu) => {
  const dispatch: Dispatch = useDispatch();
  const { removeFunc } = useSelector((state: RootState) => state.dataa);
  const [idd, setId] = useState(0);

  const handleDelete = (id: number) => {
    dispatch(addPop(true));
    setId(id);
  };

  useEffect(() => {
    if (removeFunc === true) {
      const copy = formData?.education?.filter((_, index) => index !== idd);
      setValue("education", copy);
      dispatch(addRemove(false));
    }
  }, [removeFunc, idd, formData, setValue, dispatch]);

  const handleClick = () => {
    dispatch(addSelect(false));
    if (formData?.education.length !== 0) {
      dispatch(addElave(true));
    } else {
      dispatch(addElave(false));
      dispatch(changeTehsilPage(1));
    }
    dispatch(addData(-1));
  };

  const renderEducationItems = () => {
    return formData?.education?.map((elem, index) => (
      <div
        className="border flex-grow rounded-full flex justify-between items-center relative pr-5 background mb-5"
        key={index}
      >
        <div className="w-36 rounded-l-full flex items-center">
          <div className="info flex gap-5 px-5 py-1 ">
            <span>{index + 1}. </span>
            <span> {elem.university}</span>
          </div>
        </div>
        <div className="pr-3">
          <div className="level">
            <span> {elem.specialty?.answer}</span>
          </div>
        </div>
        <div className="remove cursor-pointer items-end ml-2">
          <Icon
            icon="material-symbols:cancel"
            style={{ color: "red" }}
            onClick={() => handleDelete(index)}
          />
        </div>
      </div>
    ));
  };

  return (
    <div>
      {renderEducationItems()}
      <div className="w-full flex items-center justify-center mt-5">
        <button
          type="button"
          className="border p-2 rounded-full px-5 items-center bg-qss-input"
          onClick={handleClick}
        >
          Yeni təhsil əlavə et +
        </button>
      </div>
    </div>
  );
};

export default Educations;
