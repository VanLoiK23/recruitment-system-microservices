import React, { useState } from 'react';
import { User, Building, FileText, Bell, Sliders } from 'lucide-react';
import ProfileTab from './ProfileTab';
import CompanyTab from './CompanyTab';
import TemplatesTab from './TemplatesTab';

const tabs = [
  { id: 'profile', label: 'Profile & Account', icon: User },
  { id: 'company', label: 'Company Profile', icon: Building },
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: Sliders },
];

export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'company':
        return <CompanyTab />;
      case 'templates':
        return <TemplatesTab />;
      case 'notifications':
        return <div className="p-8"><h3 className="text-lg font-semibold text-gray-900">Notifications Settings</h3></div>;
      case 'preferences':
        return <div className="p-8"><h3 className="text-lg font-semibold text-gray-900">System Preferences</h3></div>;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-72 bg-white border-r border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 px-2">Settings</h2>
        <nav className="space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#5D5CDE]/10 text-[#5D5CDE]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 p-10">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}