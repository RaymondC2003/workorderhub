import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workorders", label: "Work Orders" },
  { href: "/workorders/create", label: "Create Order" },
  { href: "/bulk-upload", label: "Bulk Upload" },
];

export default function Sidebar() {
  const router = useRouter();
  return (
    <aside className="w-56 bg-slate-800 text-slate-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-700 flex items-center justify-center">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
          <Image
            src="/logo.png"
            alt="WorkOrderHub"
            width={200}
            height={10}
            className="shrink-0 object-contain"
          />
        </Link>
      </div>
      <nav className="p-2 flex-1">
        <ul className="space-y-0.5">
          {nav.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block px-3 py-2 rounded-md text-sm ${
                  router.pathname === href
                    ? "bg-slate-700 text-white"
                    : "hover:bg-slate-700/50"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
