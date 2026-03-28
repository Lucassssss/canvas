import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white mt-12">
      <div className="w-full px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-neutral-600">
            <a href="#" className="hover:text-neutral-900 transition-colors">关于我们</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">帮助中心</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">服务条款</a>
          </div>
          
          <div className="text-sm text-neutral-500">
            © 2026 joii. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
