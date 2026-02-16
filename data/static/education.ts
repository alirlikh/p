export interface IEducation {
  id: number;
  degree: string;
  degreeTitle: string;
  college: string;
  startTime: string;
  GraduateTime: string;
  certifcate: null | string;
}

export const educations: IEducation[] = [
  {
    id: 1,
    degree: "Bachelor degree",
    degreeTitle: "Computer Engineering",
    college: "Tabriz University",
    startTime: "Sep 2019",
    GraduateTime: "Aug 2023",
    certifcate: null,
  },
  {
    id: 2,
    degree: "High School Diploma",
    degreeTitle: "Mathematics",
    college: "Allameh Helli High School",
    startTime: "Oct 2013",
    GraduateTime: "Jun 2019",
    certifcate: null,
  },
];
