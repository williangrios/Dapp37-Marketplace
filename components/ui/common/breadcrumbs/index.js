import { Fragment } from "react";
import ActiveLink from "../link";

const BreadCrumbItem = ({ item, i }) => {
  return (
    <li
      className={`${
        i == 0 ? "pr-4 " : "px-4 "
      } font-medium text-gray-500 hover:text-gray-900`}
    >
      <ActiveLink href={item.href}>
        <div>{item.value}</div>
      </ActiveLink>
    </li>
  );
};

export default function Breadcrumbs({ items, isAdmin }) {
  return (
    <nav
      aria-label="breadcrumb"
      className="flex flex-row-reverse p-4 sm:px-6 lg:px-8"
    >
      <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
        {items.map((item, i) => (
          <Fragment key={item.href}>
            {" "}
            {!item.requireAdmin && <BreadCrumbItem item={item} i={i} />}
            {item.requireAdmin && isAdmin && (
              <BreadCrumbItem item={item} i={i} />
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
