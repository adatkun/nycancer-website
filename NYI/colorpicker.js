import React, { useState } from 'react';

const NYI_COLORS = {
  navy: { name: 'Navy', value: '#1e3a5f', light: false },
  navyDark: { name: 'Navy Dark', value: '#152a45', light: false },
  blue: { name: 'Blue', value: '#00a3e0', light: false },
  blueLight: { name: 'Blue Light', value: '#33b5e8', light: false },
  teal: { name: 'Teal', value: '#00b4b4', light: false },
  purple: { name: 'Purple', value: '#6b5b95', light: false },
  white: { name: 'White', value: '#ffffff', light: true },
  lightGray: { name: 'Light Gray', value: '#f8f9fa', light: true },
  gray: { name: 'Gray', value: '#5a5a5a', light: false },
};

const colorKeys = Object.keys(NYI_COLORS);

export default function HeaderColorPicker() {
  const [colors, setColors] = useState({
    eyebrowBg: 'lightGray',
    callButton: 'blue',
    portalLinkBg: 'purple',
    portalLinkText: 'purple',
    appointmentBg: 'teal',
    navbarBg: 'white',
    navLinkHover: 'blue',
    dropdownAccent: 'blue',
  });

  const cycleColor = (element) => {
    setColors(prev => {
      const currentIndex = colorKeys.indexOf(prev[element]);
      const nextIndex = (currentIndex + 1) % colorKeys.length;
      return { ...prev, [element]: colorKeys[nextIndex] };
    });
  };

  const getColor = (key) => NYI_COLORS[colors[key]].value;
  const getColorName = (key) => NYI_COLORS[colors[key]].name;
  const isLight = (key) => NYI_COLORS[colors[key]].light;

  const generateCSS = () => {
    return `/* NYI Header Color Scheme */
.eyebrow { background: ${getColor('eyebrowBg')}; }
.call-button { color: ${getColor('callButton')}; }
.portal-link {
  background: ${getColor('portalLinkBg')}20;
  border-color: ${getColor('portalLinkBg')}40;
  color: ${getColor('portalLinkText')};
}
.portal-link i { color: ${getColor('portalLinkText')}; }
.appointment-button {
  background: linear-gradient(135deg, ${getColor('appointmentBg')}, ${getColor('appointmentBg')}dd);
}
nav.navbar { background: ${getColor('navbarBg')}; }
.nav-links a:hover { color: ${getColor('navLinkHover')}; }
.dropdown-content i { color: ${getColor('dropdownAccent')}; }`;
  };

  const [showCSS, setShowCSS] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Instructions */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4 text-center">
        <h1 className="text-xl font-bold mb-1">NYI Header Color Picker</h1>
        <p className="text-sm opacity-90">Click on any highlighted element to cycle through NYI brand colors</p>
      </div>

      {/* Color Legend */}
      <div className="bg-white border-b p-3">
        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(NYI_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1 text-xs">
              <div 
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: color.value }}
              />
              <span className="text-gray-600">{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Header Preview */}
      <div className="bg-white shadow-lg">
        
        {/* Eyebrow */}
        <div 
          onClick={() => cycleColor('eyebrowBg')}
          className="flex justify-between items-center px-6 py-2 text-sm cursor-pointer ring-2 ring-pink-400 ring-offset-1 relative"
          style={{ backgroundColor: getColor('eyebrowBg') }}
        >
          <span className="absolute -top-2 left-2 bg-pink-400 text-white text-xs px-2 py-0.5 rounded">
            Eyebrow BG: {getColorName('eyebrowBg')}
          </span>
          <span className={`italic font-medium ${isLight('eyebrowBg') ? 'text-gray-600' : 'text-white'}`}>
            The Future of Medical Imaging is Clear
          </span>
          <div className="flex gap-4 items-center">
            <span 
              onClick={(e) => { e.stopPropagation(); cycleColor('callButton'); }}
              className="font-semibold flex items-center gap-2 cursor-pointer ring-2 ring-blue-400 px-2 py-1 rounded relative"
              style={{ color: getColor('callButton') }}
            >
              <span className="absolute -top-4 left-0 bg-blue-400 text-white text-xs px-1 rounded whitespace-nowrap">
                Call: {getColorName('callButton')}
              </span>
              📞 (833) 269-4624
            </span>
            <span 
              onClick={(e) => { e.stopPropagation(); cycleColor('portalLinkBg'); }}
              className="flex items-center gap-2 cursor-pointer ring-2 ring-purple-400 px-3 py-1 rounded-full relative"
              style={{ 
                backgroundColor: `${getColor('portalLinkBg')}15`,
                borderWidth: '1px',
                borderColor: `${getColor('portalLinkBg')}40`,
                color: getColor('portalLinkText')
              }}
            >
              <span className="absolute -top-4 left-0 bg-purple-400 text-white text-xs px-1 rounded whitespace-nowrap">
                Portal: {getColorName('portalLinkBg')}
              </span>
              👤 Patient Portal
            </span>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-600 rounded flex items-center justify-center text-white font-bold text-lg">
              NYI
            </div>
            <div>
              <div className="font-bold text-slate-800 text-lg">New York Imaging</div>
              <div className="text-xs text-gray-500">Specialists</div>
            </div>
          </div>
          <button
            onClick={() => cycleColor('appointmentBg')}
            className="text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 cursor-pointer ring-2 ring-teal-400 ring-offset-2 relative"
            style={{ 
              background: `linear-gradient(135deg, ${getColor('appointmentBg')}, ${getColor('appointmentBg')}cc)`,
              boxShadow: `0 4px 14px ${getColor('appointmentBg')}50`
            }}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
              Appt Btn: {getColorName('appointmentBg')}
            </span>
            📅 Request Appointment
          </button>
        </div>

        {/* Navigation */}
        <nav 
          onClick={() => cycleColor('navbarBg')}
          className="flex justify-center gap-8 py-4 cursor-pointer ring-2 ring-orange-400 ring-offset-1 relative"
          style={{ backgroundColor: getColor('navbarBg') }}
        >
          <span className="absolute -top-2 left-2 bg-orange-400 text-white text-xs px-2 py-0.5 rounded">
            Nav BG: {getColorName('navbarBg')}
          </span>
          
          <span 
            onClick={(e) => { e.stopPropagation(); cycleColor('navLinkHover'); }}
            className="font-medium cursor-pointer ring-2 ring-green-400 px-2 py-1 rounded relative"
            style={{ color: getColor('navLinkHover') }}
          >
            <span className="absolute -top-5 left-0 bg-green-500 text-white text-xs px-1 rounded whitespace-nowrap">
              Active/Hover: {getColorName('navLinkHover')}
            </span>
            Locations
          </span>
          
          <span className={`font-medium ${isLight('navbarBg') ? 'text-gray-700' : 'text-white'}`}>
            Services ▾
          </span>
          <span className={`font-medium ${isLight('navbarBg') ? 'text-gray-700' : 'text-white'}`}>
            About ▾
          </span>
          <span className={`font-medium ${isLight('navbarBg') ? 'text-gray-700' : 'text-white'}`}>
            Portals ▾
          </span>
        </nav>

        {/* Dropdown Preview */}
        <div className="flex justify-center pb-4" style={{ backgroundColor: getColor('navbarBg') }}>
          <div 
            onClick={() => cycleColor('dropdownAccent')}
            className="bg-white rounded-xl shadow-xl p-4 w-64 cursor-pointer ring-2 ring-cyan-400 relative"
          >
            <span className="absolute -top-2 left-2 bg-cyan-500 text-white text-xs px-2 py-0.5 rounded">
              Dropdown Icons: {getColorName('dropdownAccent')}
            </span>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                <span style={{ color: getColor('dropdownAccent') }}>🦴</span>
                <span className="text-gray-700">Bone Density</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                <span style={{ color: getColor('dropdownAccent') }}>🔄</span>
                <span className="text-gray-700">CT Scan</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                <span style={{ color: getColor('dropdownAccent') }}>🧲</span>
                <span className="text-gray-700">MRI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Selections Panel */}
      <div className="max-w-4xl mx-auto mt-6 p-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Current Color Selections</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(colors).map(([key, colorKey]) => (
              <div key={key} className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border-2 border-gray-300"
                  style={{ backgroundColor: NYI_COLORS[colorKey].value }}
                />
                <div>
                  <div className="text-xs text-gray-500">{key}</div>
                  <div className="text-sm font-medium">{NYI_COLORS[colorKey].name}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-3">
            <button 
              onClick={() => setShowCSS(!showCSS)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition"
            >
              {showCSS ? 'Hide' : 'Show'} Generated CSS
            </button>
            <button 
              onClick={() => setColors({
                eyebrowBg: 'lightGray',
                callButton: 'blue',
                portalLinkBg: 'purple',
                portalLinkText: 'purple',
                appointmentBg: 'teal',
                navbarBg: 'white',
                navLinkHover: 'blue',
                dropdownAccent: 'blue',
              })}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Reset to Default
            </button>
          </div>

          {showCSS && (
            <pre className="mt-4 bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {generateCSS()}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}