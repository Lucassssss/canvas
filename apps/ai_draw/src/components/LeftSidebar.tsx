import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Folder, User, HelpCircle, Plus } from 'lucide-react'

export const LeftSidebar: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="sidebar-left shadow-md">
      <Link
        to="/canvas"
        className="sidebar-left-btn"
        title="新建"
        onClick={(e) => e.stopPropagation()}
      >
        <Plus size={20} />
      </Link>
      <Link
        to="/"
        className={`sidebar-left-btn ${isActive('/') ? 'active' : ''}`}
        title="首页"
      >
        <Home size={20} />
      </Link>
      <Link
        to="/projects"
        className={`sidebar-left-btn ${isActive('/projects') ? 'active' : ''}`}
        title="项目"
      >
        <Folder size={20} />
      </Link>
      <Link
        to="/profile"
        className={`sidebar-left-btn ${isActive('/profile') ? 'active' : ''}`}
        title="个人"
      >
        <User size={20} />
      </Link>
      <Link
        to="/help"
        className="sidebar-left-btn"
        title="帮助"
      >
        <HelpCircle size={20} />
      </Link>
    </div>
  )
}
