import { JSX } from "react";
import { GithubIcon } from "../icons/Github.icon";
import { LinkdinIcon } from "../icons/Linkdin.icon";
import { MailIcon } from "../icons/Mail.icon";
import NavLink from "../Link/navLink/Nav.link";

export interface IMenu {
  id: number;
  title: string;
  href: string;
  isIcon: boolean;
  icon?: JSX.Element;
}

export default function Header() {
  //TODO: usememo and env file
  const menuItem: IMenu[] = [
    { id: 1, title: "Alireza", href: "/", isIcon: false },
    { id: 2, title: "project", href: "/project", isIcon: false },
    { id: 3, title: "experience", href: "/experience", isIcon: false },
    { id: 4, title: "education", href: "/education", isIcon: false },
    {
      id: 5,
      title: "Linkdin",
      href: "https://linkedin.com/in/alireza-jalili",
      isIcon: true,
      icon: <LinkdinIcon />,
    },
    {
      id: 6,
      title: "Github",
      href: "https://github.com/alirlikh",
      isIcon: true,
      icon: <GithubIcon />,
    },
    {
      id: 7,
      title: "Mail",
      href: "mailto:alirezajalili.pm@gmail.com",
      isIcon: true,
      icon: <MailIcon />,
    },
  ];
  return (
    <header className="fixed p-3 left-1/2 transform -translate-x-1/2  max-w-80 bottom-16 md:max-w-155.5 md:top-0 md:bottom-auto z-10 ">
      <nav className="bg-gray-scale/35  backdrop-blur-xl rounded-full px-5 py-2 overflow-auto no-scrollbar">
        <ul className="flex flex-row p-2 justify-between  items-center ">
          {menuItem?.map((item: IMenu) =>
            !item.isIcon ? (
              <li className="mx-3 p-1 my-1 grow flex-1 shrink " key={item.id}>
                <NavLink href={item.href}>{item.title}</NavLink>
              </li>
            ) : (
              <li
                key={item.id}
                className="hidden md:flex flex-row  items-center justify-between m-0 p-1"
              >
                <a
                  target="_blank"
                  href={item.href}
                  rel="noopener noreferrer"
                  aria-label={item.title}
                >
                  {item.icon}
                </a>
              </li>
            ),
          )}
        </ul>
      </nav>
    </header>
  );
}
