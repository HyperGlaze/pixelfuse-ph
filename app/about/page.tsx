"use client";

import { useEffect, useState } from "react";
import { Facebook, Info, Users } from "lucide-react";

export default function AboutPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  if (!settings) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">Loading information...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">About PixelFuse PH</h1>
        <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
      </div>

      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="bg-purple-600/20 p-3 rounded-lg">
            <Info className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Who We Are</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {settings.aboutDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-600/20 p-3 rounded-lg">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">The Developers</h2>
            <h3 className="text-lg font-bold text-purple-400 mb-2">QuadCore_023</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {settings.aboutDevs}
            </p>
          </div>
        </div>
      </div>

      {settings.facebookUrl && (
        <div className="flex justify-center pt-8 border-t border-gray-800">
          <a
            href={settings.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(24,119,242,0.4)]"
          >
            <Facebook className="w-6 h-6" />
            <span>Follow our Facebook Page</span>
          </a>
        </div>
      )}
    </div>
  );
}
