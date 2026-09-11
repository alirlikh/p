export interface IExperience {
  id: number;
  jobTitle: string;
  companyName: string;
  type: string;
  startTime: string;
  endTime: string;
  location: string;
  dutyDesc: IDuty[];
}

export interface IDuty {
  id: number;
  name: string;
  duty: string[];
}

export const experiences: IExperience[] = [
  {
    id: 1,
    jobTitle: "Full-Stack",
    companyName: "Gunesh Bilgy",
    type: "contract",
    startTime: "June 2022",
    endTime: "December 2023",
    location: "Tabriz-Iran",
    dutyDesc: [
      {
        id: 1,
        name: "E-commerce Project for Asamarpich",
        duty: [
          "Conceptualized and implemented the blog and menu sections to improve user engagement",
          "Developed and integrated user authentication systems, including signup and signin pages",
          "Utilized React to create a dynamic and engaging user interface",
          "Employed MongoDB as the database for storing e-commerce data",
        ],
      },
      {
        id: 2,
        name: "Admin Panel Development for Petronam",
        duty: [
          "Spearheaded the development of an admin panel for a production and sales automation system.",
          "Implemented secure login mechanisms, including SMS-based authentication",
          "Monitored and managed inventory data, presented comprehensive statistics through intuitive charts, and facilitated invoice printing and management",
        ],
      },
      {
        id: 3,
        name: "Financial System for Tabriz University",
        duty: [
          "Designed and developed a financial system for Tabriz University",
          "Monitored and managed inventory data, presented comprehensive statistics through intuitive charts, and facilitated invoice printing and management",
          "Integrated reporting functionalities with advanced filtering options for detailed analysis",
          "Conducted CRUD operations for various financial tasks, ensuring data accuracy and integrity",
          "Managed form state and validation using Formik and Yup, streamlining financial processes",
        ],
      },
    ],
  },
];
