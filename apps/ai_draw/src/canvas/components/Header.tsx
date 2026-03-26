import React from 'react'
import { Zap, User } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">Joii</span>
      </div>
      <div className="header-right">
        <div className="credits">
          <Zap size={14} />
          <span>1016</span>
        </div>
        <div className="avatar">
          <User size={20} className="w-full h-full p-1.5 text-gray-500" />
        </div>
      </div>
    </header>
  )
}
