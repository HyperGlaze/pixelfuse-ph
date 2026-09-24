"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2 } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8 text-center text-gray-400">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Secret Logo Link */}
        <Link 
          href={isAdmin ? "/" : "/admin"}
          className="group flex items-center space-x-2 transition-transform hover:scale-110"
          title={isAdmin ? "Return to Public Site" : "Admin Login"}
        >
          <div className="bg-purple-600/20 p-2 rounded-xl group-hover:bg-purple-600/40 transition-colors">
            <Gamepad2 className="w-6 h-6 text-purple-500 group-hover:text-purple-400" />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            PixelFuse PH
          </span>
        </Link>
        <p className="text-sm">© {new Date().getFullYear()} PixelFuse PH. All rights reserved.</p>
      </div>
    </footer>
  );
}
