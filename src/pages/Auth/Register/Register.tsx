import NavBar from "pages/Landing/components/NavBar";
import Footer from "pages/Landing/components/Footer";
import ImageSection from "../components/ImageSection";
import RegisterSection from "./components/RegisterSection";
import { useSelector } from "react-redux";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import GetStage from "services/GetStage";

const Register = () => {
    
//   const {  useGetQuestionsQuery } = GetStage();
//   const {
//     data: questionsData
//   }= useGetQuestionsQuery('orta-texniki-ve-ali-tehsil-suallari')
//   console.log(questionsData);
  
    return (
        <div className="h-screeen">
            <div className="w-full z-10 relative px-[220px]">
                <NavBar />
            </div>
            <div className="flex w-full">
                <ImageSection />
                <RegisterSection />
            </div>
            <Footer />
        </div>
    )
};

export default Register;