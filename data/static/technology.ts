export interface ITechnology {
  id: number;
  name: string;
  items: ITechnologyItem[];
}

export interface ITechnologyItem {
  name: string;
  url: string;
}

export const technology: ITechnology[] = [
  {
    id: 1,
    name: "Frontend Technology",
    items: [
      {
        name: "React",
        url: "/images/react.svg",
      },
      {
        name: "Next js",
        url: "/images/next.svg",
      },
      {
        name: "Tailwind Css",
        url: "/images/tw.svg",
      },
      {
        name: "Bootstrap",
        url: "/images/boot.svg",
      },
    ],
  },
  {
    id: 2,
    name: "Backend Technology",
    items: [
      {
        name: "Node Js",
        url: "/images/node.svg",
      },
      {
        name: "Express Js",
        url: "/images/express.svg",
      },
      {
        name: "Nest Js",
        url: "/images/nest.svg",
      },
    ],
  },
  {
    id: 3,
    name: "Languages",
    items: [
      {
        name: "Javscript",
        url: "/images/js.svg",
      },
      {
        name: "Typescript",
        url: "/images/ts.svg",
      },
    ],
  },
  {
    id: 4,
    name: "Database",
    items: [
      {
        name: "Mongo db",
        url: "/images/mongo.svg",
      },
      {
        name: "My Sql",
        url: "/images/mysql.svg",
      },
    ],
  },
];
