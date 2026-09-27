import React from 'react';
import { Upload } from 'lucide-react';

export default function ProfileTab() {
  return (
    <div className="p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Profile & Account</h3>
      
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
          <span className="text-gray-400 font-medium text-2xl">JD</span>
        </div>
        <div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-2">
            <Upload size={16} />
            Upload Avatar
          </button>
          <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 2MB</p>
        </div>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none" defaultValue="John" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none" defaultValue="Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none" defaultValue="Senior Recruiter" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none" defaultValue="+1 234 567 890" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn Profile</label>
            <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none" defaultValue="https://linkedin.com/in/johndoe" />
          </div>
        </div>

        <hr className="border-gray-200 my-8" />

        <h4 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h4>
        <div className="grid grid-cols-1 gap-5 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] focus:border-[#5D5CDE] outline-none" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button type="button" className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="button" className="px-5 py-2.5 text-sm font-medium text-white bg-[#5D5CDE] rounded-lg hover:bg-[#4A49B2] transition-colors shadow-sm">Save Changes</button>
        </div>
      </form>
    </div>
  );
}