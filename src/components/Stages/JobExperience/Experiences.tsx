import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

import { Icon } from "@iconify/react";
import { addSelect } from "state/dataSlice";
import { JobExperienceValues } from "./JobExperienceForm";
import { AddExpFormValues } from "./ExperienceAdd";

import removeIcon from "../../../assets/Vector.svg";

interface Experience {
  formData: JobExperienceValues;
  handleEdit: (expIndex: number) => void;
  handleRemove: (expIndex: number) => void;
  setIsAdding?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Experiences = ({
  formData,
  handleEdit,
  handleRemove,
  setIsAdding,
}: Experience) => {
  const dispatch: Dispatch = useDispatch();

  const renderEducationItems = () => {
    return (
      <>
        <ul className="mt-8">
          {formData?.experiences &&
            formData?.experiences.map(
              (exp: AddExpFormValues, index: number) => (
                <li
                  key={index}
                  className="p-2.5 border rounded-full flex justify-evenly items-center m-2 relative"
                >
                  <div className="info w-48 flex">
                    <span>{index + 1}. </span>
                    <span>
                      {exp?.company}, {exp?.profession}
                    </span>
                  </div>
                  <div className="separator absolute h-full w-px right-64"></div>
                  <div className="dates w-40 flex justify-center">
                    {exp.startDate.split("-").reverse().join("/").slice(3)}{" "}
                    {exp.endDate &&
                      `-  ${
                        exp.currentWorking === true
                          ? exp.endDate?.split("-").reverse().join("/")
                          : exp.endDate?.split("-").reverse().join("/").slice(3)
                      }`}
                  </div>
                  <div className="separator absolute h-full w-px right-20"></div>
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
                </li>
              )
            )}
        </ul>
      </>
    );
  };

  return (
    <div>
      {renderEducationItems()}
      <button
        className="add py-2 px-4 w-72 h-12 m-auto rounded-2xl flex justify-evenly items-center mt-5"
        onClick={() => {
          setIsAdding && setIsAdding(true);
          dispatch(addSelect(false));
        }}
      >
        Yeni iş yeri əlavə et +
      </button>
      <div className="w-full flex items-center justify-center mt-5"></div>
    </div>
  );
};

export default Experiences;
