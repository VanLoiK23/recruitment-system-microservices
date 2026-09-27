import React from 'react';
import { Upload, MapPin } from 'lucide-react';

export default function CompanyTab() {
  return (
    <div className="p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Company Profile</h3>

      <div className="mb-12 relative">
        <div className="h-40 bg-slate-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/90 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors z-10 shadow-sm">
            <Upload size={16} />
            Update Cover Image
          </button>
        </div>
        
        <div className="absolute -bottom-8 left-8 flex items-end gap-4">
          <div className="w-24 h-24 bg-white rounded-xl border border-gray-200 shadow-md flex items-center justify-center relative overflow-hidden">
            <span className="text-gray-400 font-bold text-sm">LOGO</span>
          </div>
          <button className="mb-2 text-sm text-[#5D5CDE] font-medium hover:text-[#4A49B2] hover:underline">Change Logo</button>
        </div>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none" defaultValue="TechRoute Corporation" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
            <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none" defaultValue="https://techroute.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none bg-white">
              <option>Information Technology</option>
              <option>Finance</option>
              <option>Healthcare</option>
              <option>Education</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Size</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none bg-white">
              <option>1-50 employees</option>
              <option>51-200 employees</option>
              <option>201-500 employees</option>
              <option>500+ employees</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax ID</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none" defaultValue="0123456789" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">About Us</label>
          <textarea rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none resize-none" defaultValue="TechRoute is a leading technology company specializing in innovative recruitment solutions." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Headquarters</label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3.5 top-3 text-gray-400" />
            <input type="text" className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none" defaultValue="123 Tech Street, Silicon Valley, CA" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button type="button" className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="button" className="px-5 py-2.5 text-sm font-medium text-white bg-[#5D5CDE] rounded-lg hover:bg-[#4A49B2] transition-colors shadow-sm">Save Profile</button>
        </div>
      </form>
    </div>
  );
}