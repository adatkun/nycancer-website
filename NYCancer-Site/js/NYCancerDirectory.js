import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X, Menu, Phone, Clock, Globe, Book, Star, ChevronDown, Users, Briefcase, Heart } from 'lucide-react';

const NYCancerDirectory = () => {
  // Application state
  const [activeTab, setActiveTab] = useState('physicians');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [physicians, setPhysicians] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  
  // Filter options derived from data
  const [specialties, setSpecialties] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [languages, setLanguages] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;
  
  // Mock API fetch (would be replaced with actual API calls)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
          try {
              // Show loading indicator
              loadingIndicator.style.display = 'flex';
              
              // Fetch locations data
              const locationsResponse = await fetch('https://api.nycancer.com/open/directory/locations/all');
              if (!locationsResponse.ok) {
                  throw new Error(`Locations API responded with status: ${locationsResponse.status}`);
              }
              const locationsData = await locationsResponse.json();
              
              // Fetch physicians data
              const physiciansResponse = await fetch('https://api.nycancer.com/open/directory/filter/');
              if (!physiciansResponse.ok) {
                  throw new Error(`Physicians API responded with status: ${physiciansResponse.status}`);
              }
              const physiciansData = await physiciansResponse.json();
              
              // Process locations data
              allLocations = locationsData.data;
              
              // Process physicians data
              allPhysicians = physiciansData.data;
              
              // Continue with the existing code for extracting filter options...
          } catch (err) {
              console.error("Error fetching directory data:", err);
              loadingIndicator.style.display = 'none';
              
              // Show user-friendly error message
              const errorDiv = document.createElement('div');
              errorDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-6 text-center';
              errorDiv.innerHTML = `
                  <div class="text-red-600 mb-2 text-xl">⚠️ Unable to load directory data</div>
                  <p class="mb-4">We're having trouble connecting to our directory service. Please try again later.</p>
                  <button
                      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onclick="window.location.reload()"
                  >
                      Try Again
                  </button>
              `;
              document.querySelector('.directory-container').appendChild(errorDiv);
          }
              
        // Process locations data
        setLocations(mockLocationsData.data);
        
        // Process physicians data
        setPhysicians(mockPhysiciansData.data);
        
        // Extract filter options
        // Specialties
        const allSpecialties = new Set();
        mockPhysiciansData.data.forEach(physician => {
          if (physician.specialty) {
            allSpecialties.add(physician.specialty);
          }
        });
        
        mockLocationsData.data.forEach(location => {
          if (location.location_types && location.location_types.length > 0) {
            location.location_types.forEach(type => allSpecialties.add(type));
          }
        });
        
        setSpecialties(Array.from(allSpecialties));
        
        // Location options (cities/boroughs)
        const allLocationOptions = new Set();
        mockLocationsData.data.forEach(location => {
          if (location.address) {
            const addressParts = location.address.split(',');
            if (addressParts.length >= 2) {
              const cityState = addressParts[1].trim();
              const cityParts = cityState.split(' ');
              if (cityParts.length >= 1) {
                allLocationOptions.add(cityParts[0]);
              }
            }
          }
        });
        
        setLocationOptions(Array.from(allLocationOptions));
        
        // Languages
        const allLanguages = new Set();
        mockPhysiciansData.data.forEach(physician => {
          if (physician.languages) {
            physician.languages.split(',').forEach(lang => 
              allLanguages.add(lang.trim())
            );
          }
        });
        
        setLanguages(Array.from(allLanguages));
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching directory data:", err);
        setError("Unable to load directory data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Toggle filter selection
  const toggleFilter = (type, value) => {
    switch(type) {
      case 'specialty':
        setSelectedSpecialties(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'location':
        setSelectedLocations(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'language':
        setSelectedLanguages(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      default:
        break;
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialties([]);
    setSelectedLocations([]);
    setSelectedLanguages([]);
  };
  
  // Filter results based on current criteria
  const getFilteredResults = () => {
    if (activeTab === 'physicians') {
      return physicians.filter(physician => {
        // Search query matching
        const matchesSearch = !searchQuery || 
          physician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (physician.specialty && physician.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Specialty filter
        const matchesSpecialties = selectedSpecialties.length === 0 || 
          (physician.specialty && selectedSpecialties.includes(physician.specialty));
        
        // Location filter (check if physician practices at any of the selected locations)
        const matchesLocations = selectedLocations.length === 0 ||
          (physician.active_locations && physician.active_locations.some(loc => {
            if (loc.address) {
              const addressParts = loc.address.split(',');
              if (addressParts.length >= 2) {
                const cityState = addressParts[1].trim();
                const cityParts = cityState.split(' ');
                if (cityParts.length >= 1) {
                  return selectedLocations.includes(cityParts[0]);
                }
              }
            }
            return false;
          }));
        
        // Language filter
        const matchesLanguages = selectedLanguages.length === 0 ||
          (physician.languages && 
            selectedLanguages.some(lang => 
              physician.languages.toLowerCase().includes(lang.toLowerCase())
            ));
        
        return matchesSearch && matchesSpecialties && matchesLocations && matchesLanguages;
      });
    } else {
      // Filter locations
      return locations.filter(location => {
        // Search query matching
        const matchesSearch = !searchQuery || 
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (location.address && location.address.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Specialty/service filter
        const matchesSpecialties = selectedSpecialties.length === 0 || 
          (location.location_types && location.location_types.some(type => 
            selectedSpecialties.includes(type)
          ));
        
        // Location city/borough filter
        const matchesLocations = selectedLocations.length === 0 ||
          (location.address && (() => {
            const addressParts = location.address.split(',');
            if (addressParts.length >= 2) {
              const cityState = addressParts[1].trim();
              const cityParts = cityState.split(' ');
              if (cityParts.length >= 1) {
                return selectedLocations.includes(cityParts[0]);
              }
            }
            return false;
          })());
        
        return matchesSearch && matchesSpecialties && matchesLocations;
      });
    }
  };
  
  const filteredResults = getFilteredResults();
  
  // Pagination
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );
  
  // Extract city and state from address
  const extractCityState = (address) => {
    if (!address) return { city: '', state: '' };
    
    const parts = address.split(',');
    if (parts.length < 2) return { city: '', state: '' };
    
    const cityStatePart = parts[1].trim();
    const cityStateParts = cityStatePart.split(' ');
    
    if (cityStateParts.length < 2) return { city: cityStatePart, state: '' };
    
    const state = cityStateParts[cityStateParts.length - 1];
    const city = cityStatePart.substring(0, cityStatePart.length - state.length - 1).trim();
    
    return { city, state };
  };
  
  // Get borough name from address
  const getBoroughFromAddress = (address) => {
    if (!address) return '';
    
    const { city } = extractCityState(address);
    
    const boroughs = {
      'Brooklyn': 'Brooklyn',
      'Queens': 'Queens',
      'Bronx': 'Bronx',
      'Staten Island': 'Staten Island', 
      'New York': 'Manhattan',
      'Manhattan': 'Manhattan'
    };
    
    return boroughs[city] || city;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading directory...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-3xl mx-auto">
        <div className="text-red-600 mb-2 text-xl">⚠️ {error}</div>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">NYCancer Directory</h1>
        <p className="text-gray-600">Find healthcare providers and locations in your community</p>
      </header>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-lg ${activeTab === 'physicians' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('physicians')}
        >
          Find a Physician
        </button>
        <button
          className={`px-4 py-2 font-medium text-lg ${activeTab === 'locations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('locations')}
        >
          Our Locations
        </button>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder={activeTab === 'physicians' ? "Search by physician name or specialty..." : "Search by location name or address..."}
            className="w-full px-4 py-2 pl-10 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>
        
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filtersOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter size={18} />
            Filters
            {(selectedSpecialties.length + selectedLocations.length + selectedLanguages.length) > 0 && (
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {selectedSpecialties.length + selectedLocations.length + selectedLanguages.length}
              </span>
            )}
          </button>
          
          {activeTab === 'locations' && (
            <div className="flex rounded-lg overflow-hidden border">
              <button 
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                onClick={() => setViewMode('list')}
              >
                <Menu size={18} />
              </button>
              <button 
                className={`px-3 py-2 ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                onClick={() => setViewMode('map')}
              >
                <MapPin size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Filters Panel */}
      {filtersOpen && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filter Results</h3>
            {(selectedSpecialties.length + selectedLocations.length + selectedLanguages.length) > 0 && (
              <button 
                className="text-blue-600 text-sm flex items-center gap-1"
                onClick={clearFilters}
              >
                <X size={16} /> Clear all filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Specialties Filter */}
            <div>
              <h4 className="font-medium mb-2">Specialties</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {specialties.map(specialty => (
                  <label key={specialty} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSpecialties.includes(specialty)}
                      onChange={() => toggleFilter('specialty', specialty)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Locations Filter */}
            <div>
              <h4 className="font-medium mb-2">Locations</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {locationOptions.map(location => (
                  <label key={location} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => toggleFilter('location', location)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">{location}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Languages Filter - only for physicians */}
            {activeTab === 'physicians' && (
              <div>
                <h4 className="font-medium mb-2">Languages</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {languages.map(language => (
                    <label key={language} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(language)}
                        onChange={() => toggleFilter('language', language)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{language}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        {filteredResults.length} {activeTab === 'physicians' ? 'physicians' : 'locations'} found
      </div>
      
      {/* No Results Message */}
      {filteredResults.length === 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
          <p className="text-blue-800 font-medium">No {activeTab === 'physicians' ? 'physicians' : 'locations'} found matching your criteria.</p>
          <p className="text-blue-600 mt-2">Try adjusting your filters or search term.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear All Filters
          </button>
        </div>
      )}
      
      {/* Results Display */}
      {activeTab === 'physicians' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedResults.map(physician => (
            <div key={physician.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={physician.img || '/api/placeholder/120/120'} 
                    alt={physician.name} 
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/api/placeholder/120/120';
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-blue-800">{physician.name}</h3>
                    <p className="text-gray-600">{physician.specialty}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {physician.credentials && physician.credentials.map((credential, index) => (
                        <span key={index} className="text-xs text-gray-500">
                          {credential}{index < physician.credentials.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {physician.job_title && (
                  <div className="mt-3 flex items-center gap-2">
                    <Briefcase size={16} className="text-gray-500" />
                    <span className="text-gray-700">{physician.job_title}</span>
                  </div>
                )}
                
                {/* Locations */}
                {physician.active_locations && physician.active_locations.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                      <div className="text-sm text-gray-700">
                        {physician.active_locations.slice(0, 2).map((location, index) => (
                          <div key={index} className="mb-1">
                            {location.name}
                          </div>
                        ))}
                        {physician.active_locations.length > 2 && (
                          <span className="text-blue-600 text-xs">
                            +{physician.active_locations.length - 2} more locations
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Languages */}
                {physician.languages && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Languages:</span>
                    </div>
                    <div className="ml-6 flex flex-wrap gap-1">
                      {physician.languages.split(',').map((language, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                          {language.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Hospitals - if available */}
                {physician.hospitals && physician.hospitals.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <line x1="9" x2="15" y1="9" y2="9" />
                        <line x1="12" x2="12" y1="5" y2="19" />
                      </svg>
                      <span className="text-sm text-gray-600">Hospital Affiliations:</span>
                    </div>
                    <div className="ml-6 mt-1">
                      <span className="text-xs text-gray-700">
                        {physician.hospitals.slice(0, 2).join(', ')}
                        {physician.hospitals.length > 2 && (
                          <span className="text-blue-600"> +{physician.hospitals.length - 2} more</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Focus Areas - if available */}
                {physician.focus && physician.focus.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <Heart size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Focus Areas:</span>
                    </div>
                    <div className="ml-6 flex flex-wrap gap-1 mt-1">
                      {physician.focus.map((focus, index) => (
                        <span key={index} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex gap-2">
                  <a 
                    href={physician.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition-colors"
                  >
                    View Profile
                  </a>
                  {physician.phone && (
                    <a 
                      href={`tel:${physician.phone}`}
                      className="bg-white border border-blue-600 text-blue-600 py-2 px-4 rounded flex items-center justify-center hover:bg-blue-50"
                    >
                      <Phone size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedResults.map(location => (
              <div key={location.slug} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                <img 
                  src={location.img || '/api/placeholder/400/200'} 
                  alt={location.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/api/placeholder/400/200';
                  }}
                />
                <div className="p-4">
                  <h3 className="font-bold text-blue-800 text-xl">{location.name}</h3>
                  
                  <div className="mt-3 space-y-2">
                    {/* Address */}
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                      <div className="text-gray-700">{location.address}</div>
                    </div>
                    
                    {/* Phone */}
                    {location.internal_phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-500" />
                        <div className="text-gray-700">{location.internal_phone}</div>
                      </div>
                    )}
                    
                    {/* Location Types / Specialties */}
                    {location.location_types && location.location_types.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-700 mb-1">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {location.location_types.map((type, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Services */}
                    {location.services && location.services.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-700 mb-1">Services:</h4>
                        <div className="flex flex-wrap gap-1">
                          {location.services.map((service, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Providers at this location */}
                  {location.active_providers && location.active_providers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Users size={16} />
                        Providers at this location:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {location.active_providers.slice(0, 4).map((provider, index) => (
                          <a 
                            href={provider.link} 
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                          >
                            <img 
                              src={provider.img || '/api/placeholder/40/40'} 
                              alt={provider.name} 
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/api/placeholder/40/40';
                              }}
                            />
                            <div className="overflow-hidden">
                              <div className="text-sm font-medium text-blue-800 truncate">{provider.name}</div>
                              <div className="text-xs text-gray-600 truncate">{provider.speciality}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                      {location.active_providers.length > 4 && (
                        <div className="mt-2 text-center">
                          <a href={location.link} className="text-sm text-blue-600 hover:underline">
                            See all {location.active_providers.length} providers
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 flex gap-2">
                    <a 
                      href={location.link} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition-colors"
                    >
                      View Location
                    </a>
                    <a 
                      href={`https://maps.google.com/?q=${location.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-blue-600 text-blue-600 py-2 px-4 rounded flex items-center justify-center hover:bg-blue-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 17 4 12 9 7" />
                        <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Interactive map would display here</p>
              <p className="text-sm text-gray-500">Showing {filteredResults.length} locations</p>
            </div>
          </div>
        )
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex border rounded overflow-hidden">
            <button 
              className={`px-4 py-2 border-r ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button 
                  key={i}
                  className={`px-4 py-2 ${pageNum === currentPage ? 'bg-blue-600 text-white' : 'border-x hover:bg-gray-100'}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className={`px-4 py-2 border-l ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Info cards with related resources */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-800 text-lg mb-2">Need assistance?</h3>
          <p className="text-gray-700 mb-4">Our patient navigators can help you find the right physician for your needs.</p>
          <div className="flex items-center gap-3 text-blue-800">
            <Phone size={20} />
            <span className="font-medium">Call (800) 555-1234</span>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <h3 className="font-bold text-green-800 text-lg mb-2">New patient?</h3>
          <p className="text-gray-700 mb-4">Access our comprehensive resources to prepare for your first visit.</p>
          <a href="#" className="inline-flex items-center gap-2 text-green-800 font-medium">
            <Book size={20} />
            <span>Patient Resources</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NYCancerDirectory;
