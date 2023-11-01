export const templateOne = {
  fullName: "Javid Mammadov",
  job: "Data Scientist",

  contacts: {
    gmail: "javid.mammadov@gmail.com",
    phone: "+994 51 123 45 67",
    links: [
      { name: "in", link: "linkedin.com/in/JavidM" },
      { name: "fb", link: "facebook.com/JavidM" },
      { name: "github", link: "github.com/JavidM" },
    ],
  },

  summary: `Business/Operations Analyst with 4-year professional experience in Data Science , Operations Process Improvements(5S, Lean Production, Root Cause Analysis). Proficient in R Studio, Python, SQL, Power BI, VBA, Tableau, SPSS and SPSS Modeler Reports & Dashboards; familiar with R, Python, Big data, Hadoop Distributed File Systems and PySpark. Knowledge and experience with Statistical Analysis & Machine Learning Models, including Regression, Classification, Affinity Analysis, Text Mining, and Time Series`,

  workExperience: [
    {
      header: {
        jobTitle: "Data Scientist",
        workPlace: "Pasha Bank, Baku, AZE",
        date: {
          startDate: "September 2018",
          endDate: "Present",
        },
      },
      desc: [
        `Conduct data regression analyses of the relationship between company stock prices and industry trends, achieving a 15% more accurate prediction of performance than previous years`,
        `Utilize web scraping techniques to extract and organize competitor data`,
        `Update company data warehousing techniques such as data recall and segmentation, resulting in a 20% increase in usability for non-technical staff members`,
        `Optimized and re-sequenced store delivery routes by calling Google API and solving a TSP problem with Genetic Algorithm in Python, which resulted in a 20% route reduction while maintaining service level to key customers`,
      ],
    },
    {
      header: {
        jobTitle: "Data Scientist",
        workPlace: "Azercell Telecom, Baku, AZE",
        date: {
          startDate: "June 2016",
          endDate: "August 2018",
        },
      },
      desc: [
        `Contact Center Operations Analytics Lead Developed and implemented real-time visualized TV dashboards for internal Contact Team, which improved productivity by 33% within 1 month Collaborated with partner Contact Center’s QA team, proposed, developed, and implemented Call Rubric and QA
        Score, which improved overall team call quality by 20%`,
        `Used predictive analytics such as machine learning and data mining techniques to forecast company sales of new products with a 95% accuracy rate `,
      ],
    },
  ],

  educationAndCertifcates: {
    master: [
      {
        specialty: "M.S. Statistics",
        university: "University of Toronto",
        desc: "Toronto, CAN / 2016",
      },
    ],

    bachelor: [
      {
        specialty: "B.S. Computer Science",
        university: "ADA University",
        desc: "Baku, AZE / 2013",
      },
    ],

    certifacetes: [
      "Data Science Academy Bootcamp",
      "Certified Associate Data Scientist",
    ],
  },

  skills: {
    r: "middle",
    spark: "junior",
    python: "senior",
    aws: "middle",
    spss: "junior",
  },
};
