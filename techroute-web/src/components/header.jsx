import { useState } from "react";

const NavBar = ()=>{
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full p-6 bg-white pb-4 px-auto md:px-14 border-b border-gray-100 font-sans flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="h-8 w-8 flex items-center justify-center text-white font-bold text-sm rounded-[11px] bg-[#5B5FC7]">
                        T
                    </div>
                    <span className="text-[#5B5FC7] text-xl font-bold">Techroute</span>
                </div>
                <div className="hidden min-[650px]:flex items-center gap-7 md:gap-20">
                    <div className="hidden min-[650px]:flex items-center gap-x-12 text-sm font-medium">
                        <a href="#find-jobs" className="text-[#8A2BE2] font-semibold">Find jobs</a>
                        <a href="#my-application" className="text-gray-500 hover:text-gray-800 transition-colors">My Applications</a>
                        <a href="#messages" className="text-gray-500 hover:text-gray-800 transition-colors">Messages</a>
                    </div>
                    <div>
                        <button className="w-9 h-9 rounded-full bg-[#007AFF] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="relative min-[650px]:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="w-9 h-9 rounded-full bg-[#007AFF] flex items-center justify-center text-white hover:opacity-90 transition-opacity focus:outline-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </button>
                    {isOpen&&(
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-400">Signed in as</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">user@techroute.com</p>
                            </div>
                            <a href="#profile" className="block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                My Profile
                            </a>
          
                            <a href="#settings" className="block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Account Settings
                            </a>

                            <div className="border-t border-gray-100 my-1"></div>

                            <button 
                              onClick={() => alert('Logout logic here')}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-5,0 transition-colors font-medium"
                            >
                              Sign Out
                            </button>
                        </div>
                    )}
                </div>
        </nav>
    )
}

export default NavBar