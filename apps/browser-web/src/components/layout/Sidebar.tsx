"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Users, 
  MonitorSmartphone, 
  Globe, 
  Puzzle, 
  Building2, 
  Settings,
  ShieldAlert
} from "lucide-react";

const navItems = [
  { name: "首页总览", href: "/", icon: Home },
  { name: "账号资产", href: "/accounts", icon: Users },
  { name: "环境与设备", href: "/environments", icon: MonitorSmartphone },
  { name: "代理网络", href: "/proxies", icon: Globe },
  { name: "应用与插件", href: "/extensions", icon: Puzzle },
  { name: "企业与团队", href: "/team", icon: Building2 },
];

const bottomNavItems = [
  { name: "操作日志", href: "/logs", icon: ShieldAlert },
  { name: "全局设置", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-neutral-950 text-neutral-300 flex flex-col border-r border-neutral-800 shrink-0 sticky top-0">
      
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            J
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Joii Berry</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-neutral-500 mb-4 px-2 uppercase tracking-wider">业务中心</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive 
                  ? "bg-blue-600/10 text-blue-400 font-medium" 
                  : "hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-blue-500" : "text-neutral-500 group-hover:text-neutral-300"}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-neutral-800 space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive 
                  ? "bg-blue-600/10 text-blue-400 font-medium" 
                  : "hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-blue-500" : "text-neutral-500 group-hover:text-neutral-300"}`} />
              {item.name}
            </Link>
          );
        })}
        
        {/* User Profile Mini */}
        <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-medium text-white border border-neutral-700">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white leading-none">Admin</span>
            <span className="text-xs text-neutral-500 mt-1">超级管理员</span>
          </div>
        </div>
      </div>

    </div>
  );
}
