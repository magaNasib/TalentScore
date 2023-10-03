import { useEffect } from "react";
import b from "../services/GetStage";
import { GeneralQuestionsFormProps } from "./Stages/Education/GeneralQuestionsForm";

type ProgressBarType = {
  progress: number;
  subStageIndex:number;
  stageIndex:any
};



const ProgressBar = ({ progress = 0,subStageIndex,stageIndex }: ProgressBarType) => {
  const {useGetStageQuery} = b()
  const { data: stagesData } = useGetStageQuery();

  
  const { stage_children } = stagesData?.[stageIndex] || {};
  
  var indexx = subStageIndex+1
  return (
    <div className={` h-[22px] w-full rounded-lg flex`}>
      {/* <div
        className="absolute h-full rounded-lg transition-all duration-500 bg-qss-input flex justify-end items-center"
        style={{ width: `${progress}%` }}
      >
        <div className="circle p-3 w-12 rounded-full absolute bg-qss-secondary text-white flex justify-center">
          <span>
            {subStageIndex+1}
          </span>
        </div>
      </div> */}
      {
        stagesData?.[stageIndex]?.stage_children.map((elem,index)=>(
          <div key={index} className={`bg-qss-${subStageIndex>=index?'secondary':'input'} mr-2  h-[22px] rounded-lg transition-all duration-500 flex  justify-center text-${subStageIndex>=index?'white':'qss-secondary'}`} style={{ width: `${progress}%` }}>{index+1}</div>
        ))
      }
   
    </div>
  );
};

export default ProgressBar;
