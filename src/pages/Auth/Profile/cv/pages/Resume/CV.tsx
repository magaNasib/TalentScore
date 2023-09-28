import NavBar from "pages/Landing/components/NavBar";
import TemplateOne from "../../components/ResumeTemplates/TemplateOne";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

const CV = () => {
  return (
    <div className="w-full min-h-screen text-gray-900 bg-qss-background">
      {/* <h1 className="p-2 text-3xl font-semibold text-center">Cv Builder</h1> */}

      {/* <PDFDownloadLink document={<TemplateOne />} fileName="somename.pdf">
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download now!"
        }
      </PDFDownloadLink> */}

      {/* <PDFViewer showToolbar={false} className="w-1/2 min-h-[800px]">
        <TemplateOne />
      </PDFViewer> */}
      <div className="w-full z-10 relative px-[220px]">
        <NavBar />

      </div>
      <div className="grid grid-cols-2 p-10 h-[100%]">
        <TemplateOne />
      </div>
    </div>
  );
};

export default CV;
