import React from 'react'
import { Home, Folder, User, HelpCircle, Plus } from 'lucide-react'

export const LeftSidebar: React.FC = () => {
  return (
    <div className="sidebar-left">
      <button
        className="sidebar-left-btn"
        title="新建"
        onClick={(e) => e.stopPropagation()}
      >
        <Plus size={20} />
      </button>
      <button
        className="sidebar-left-btn"
        title="首页"
        onClick={(e) => e.stopPropagation()}
      >
        <Home size={20} />
      </button>
      <button
        className="sidebar-left-btn"
        title="项目"
        onClick={(e) => e.stopPropagation()}
      >
        <Folder size={20} />
      </button>
      <button
        className="sidebar-left-btn"
        title="个人"
        onClick={(e) => e.stopPropagation()}
      >
        <User size={20} />
      </button>
      <button
        className="sidebar-left-btn"
        title="帮助"
        onClick={(e) => e.stopPropagation()}
      >
        <HelpCircle size={20} />
      </button>
    </div>
  )
}
