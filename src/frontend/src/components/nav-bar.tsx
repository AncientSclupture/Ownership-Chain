import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function NavbarItem({ name, href }: { name: string; href: string }) {
  return (
    <Link to={`/${href}`} className="px-4 py-2 hover:text-blue-500">
      {name}
    </Link>
  );
}

export function NavigationBar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShow(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full bg-white shadow-md transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="text-lg font-semibold">OwnerChainner</div>
          <div className="flex space-x-4">
            <NavbarItem name="Dashboard" href="" />
            <NavbarItem name="Assets" href="assets" />
            <NavbarItem name="Marketplace" href="marketplace" />
          </div>
        </div>
      </div>
    </div>
  );
}
