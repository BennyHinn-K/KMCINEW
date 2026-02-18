import React from 'react';
import { Calendar, Megaphone, Radio, FileText } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-amber-500" />
            Events Overview
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Quickly see upcoming events, services, and key dates that need updates.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Review and confirm this week&apos;s services</li>
            <li>• Check upcoming conferences and missions</li>
            <li>• Ensure event details and locations are accurate</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Megaphone className="w-5 h-5 mr-2 text-emerald-500" />
            News & Announcements
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Focused space for updating what the church family needs to know right now.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Publish weekly highlights and testimonies</li>
            <li>• Schedule important announcements in advance</li>
            <li>• Keep homepage and bulletin aligned</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Radio className="w-5 h-5 mr-2 text-blue-500" />
            Live & Media Coordination
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Coordinate live services, streams, and sermon uploads with the media team.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Confirm who is serving on media and worship</li>
            <li>• Track sermons that need upload or edits</li>
            <li>• Capture key moments for digital channels</li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-slate-700" />
          Today&apos;s CMS Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold mb-2">Content</p>
            <ul className="space-y-1">
              <li>• Review new sermon notes</li>
              <li>• Update series descriptions</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Events</p>
            <ul className="space-y-1">
              <li>• Confirm upcoming dates</li>
              <li>• Add registration links</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Announcements</p>
            <ul className="space-y-1">
              <li>• Archive outdated notices</li>
              <li>• Pin key Sunday information</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Media</p>
            <ul className="space-y-1">
              <li>• Check thumbnails and titles</li>
              <li>• Verify sermon links are working</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
