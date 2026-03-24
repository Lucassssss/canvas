import React from 'react'
import { Home, Folder, User, HelpCircle, Plus } from 'lucide-react'

export const LeftSidebar: React.FC = () => {
  return (
    <div className="sidebar-left">
      <button className="sidebar-left-btn" title="新建">
        <Plus size={20} />
      </button>
      <button className="sidebar-left-btn" title="首页">
        <Home size={20} />
      </button>
      <button className="sidebar-left-btn" title="项目">
        <Folder size={20} />
      </button>
      <button className="sidebar-left-btn" title="个人">
        <User size={20} />
      </button>
      <button className="sidebar-left-btn" title="帮助">
        <HelpCircle size={20} />
      </button>
    </div>
  )
}
