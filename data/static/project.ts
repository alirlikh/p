export interface IProject {
  id: number;
  name: string;
  image: string;
  githubUrl: string;
  demoUrl: string;
}

export const projects: IProject[] = [
  {
    id: 1,
    name: "Portfolio",
    image: "/images/portfolio.png",
    githubUrl: "https://github.com/alirlikh/portfolio",
    demoUrl: "https://alireza-jalili.ir",
  },
  {
    id: 2,
    name: "E-Commerce",
    image: "/images/e-commerce.png",
    githubUrl: "https://github.com/alirlikh/store",
    demoUrl: "https://e-commerce-al.netlify.app/",
  },
  {
    id: 3,
    name: "Task Management App",
    image: "/images/task-managent-app.png",
    githubUrl: "https://github.com/alirlikh/task-management-app",
    demoUrl: "https://symphonious-heliotrope-aeeef1.netlify.app/",
  },
  {
    id: 4,
    name: "The Flip Game",
    image: "/images/the-flip-game.png",
    githubUrl: "https://github.com/alirlikh/flip-the-card",
    demoUrl: "https://filpped-image-game.netlify.app/",
  },
];
