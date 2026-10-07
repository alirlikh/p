import { JSX } from 'react';
import { GithubIcon } from '../icons/Github.icon';
import { LinkdinIcon } from '../icons/Linkdin.icon';
import { MailIcon } from '../icons/Mail.icon';
import NavLink from '../Link/navLink/Nav.link';

export interface IIcon {
  id: number;
  name: string;
  href: string;
  icon: JSX.Element;
}

const Footer = () => {
  //TODO: usememo and env file
  const iconList: IIcon[] = [
    {
      id: 1,
      name: 'Linkdin',
      href: 'https://linkedin.com/in/alireza-jalili',
      icon: <LinkdinIcon />,
    },
    {
      id: 2,
      name: 'Github',
      href: 'https://github.com/alirlikh',
      icon: <GithubIcon />,
    },
    {
      id: 3,
      name: 'Mail',
      href: 'mailto:alirezajalili.pm@gmail.com',
      icon: <MailIcon />,
    },
  ];
  return (
    <div className="flex flex-col items-start m-4 px-4 md:px-12 mt-16 mb-22 md:mb-0 ">
      <div className="w-full py-2 bg-gray-850 px-4 rounded-full flex flex-row justify-between items-center max-w-screen-2xl mx-auto">
        <p className="text-gray-300 text-sm m-2">Follow me</p>
        <div className="flex flex-row items-center w-24 justify-around">
          {iconList?.map((item) => (
            <NavLink key={item.id} href={item.href} passHref aria-label={item.name}>
              {item.icon}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="m-3">
        <span className="text-sm text-gray-300 p-2">Made with 👨‍💻🤦‍♂️❤️️</span>
      </div>
    </div>
  );
};
export default Footer;
