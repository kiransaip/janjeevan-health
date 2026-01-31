'use client';

import React, { useState, useEffect, useRef } from 'react';

// Mock data for medicines and hospitals with buy/map links
const medicines = [
    { id: 1, name: 'Paracetamol', use: 'Fever and pain relief', price: '₹20', type: 'Medicine', buyUrl: 'https://www.netmeds.com/prescriptions/paracetamol' },
    { id: 2, name: 'Amoxicillin', use: 'Bacterial infections', price: '₹150', type: 'Medicine', buyUrl: 'https://www.apollo247.com/search?q=Amoxicillin' },
    { id: 3, name: 'Metformin', use: 'Type 2 Diabetes', price: '₹60', type: 'Medicine', buyUrl: 'https://www.1mg.com/search/all?name=Metformin' },
    { id: 4, name: 'Atorvastatin', use: 'High cholesterol', price: '₹120', type: 'Medicine', buyUrl: 'https://www.netmeds.com/prescriptions/atorvastatin' },
    { id: 5, name: 'Amlodipine', use: 'High blood pressure', price: '₹45', type: 'Medicine', buyUrl: 'https://www.apollo247.com/search?q=Amlodipine' },
    { id: 6, name: 'Omeprazole', use: 'Acid reflux and ulcers', price: '₹85', type: 'Medicine', buyUrl: 'https://www.1mg.com/search/all?name=Omeprazole' },
    { id: 7, name: 'Azithromycin', use: 'Respiratory infections', price: '₹110', type: 'Medicine', buyUrl: 'https://www.netmeds.com/prescriptions/azithromycin' },
    { id: 8, name: 'Ibuprofen', use: 'Inflammation and pain', price: '₹35', type: 'Medicine', buyUrl: 'https://www.apollo247.com/search?q=Ibuprofen' },
    { id: 9, name: 'Cetirizine', use: 'Allergy relief', price: '₹25', type: 'Medicine', buyUrl: 'https://www.1mg.com/search/all?name=Cetirizine' },
    { id: 10, name: 'Pantoprazole', use: 'Gastric problems', price: '₹75', type: 'Medicine', buyUrl: 'https://www.netmeds.com/prescriptions/pantoprazole' },
    { id: 11, name: 'Montelukast', use: 'Asthma and allergies', price: '₹105', type: 'Medicine', buyUrl: 'https://www.apollo247.com/search?q=Montelukast' },
    { id: 12, name: 'Levocetirizine', use: 'Chronic allergies', price: '₹35', type: 'Medicine', buyUrl: 'https://www.1mg.com/search/all?name=Levocetirizine' },
    { id: 13, name: 'Voglibose', use: 'Diabetes management', price: '₹140', type: 'Medicine', buyUrl: 'https://www.netmeds.com/search?q=Voglibose' },
    { id: 14, name: 'Telmisartan', use: 'Hypertension', price: '₹90', type: 'Medicine', buyUrl: 'https://www.apollo247.com/search?q=Telmisartan' },
    { id: 15, name: 'Clopidogrel', use: 'Blood thinner', price: '₹130', type: 'Medicine', buyUrl: 'https://www.1mg.com/search/all?name=Clopidogrel' }
];

const hospitals = [
    { id: 101, name: 'AIIMS Delhi', location: 'New Delhi, Delhi', type: 'Hospital', specialty: 'General & Multi-specialty', mapUrl: 'https://www.google.com/maps/search/AIIMS+Delhi&t=k&layer=t' },
    { id: 102, name: 'Apollo Hospitals Greams Road', location: 'Chennai, Tamil Nadu', type: 'Hospital', specialty: 'Cardiology & Multi-specialty', mapUrl: 'https://www.google.com/maps/search/Apollo+Hospitals+Greams+Road+Chennai&t=k&layer=t' },
    { id: 103, name: 'Fortis Memorial', location: 'Gurugram, Haryana', type: 'Hospital', specialty: 'Oncology & Multi-specialty', mapUrl: 'https://www.google.com/maps/search/Fortis+Memorial+Gurugram&t=k&layer=t' },
    { id: 104, name: 'Tata Memorial Hospital', location: 'Mumbai, Maharashtra', type: 'Hospital', specialty: 'Cancer Treatment', mapUrl: 'https://www.google.com/maps/search/Tata+Memorial+Hospital+Mumbai&t=k&layer=t' },
    { id: 105, name: 'Manipal Hospital (Old Airport Road)', location: 'Bengaluru, Karnataka', type: 'Hospital', specialty: 'Multi-specialty', mapUrl: 'https://www.google.com/maps/search/Manipal+Hospital+Old+Airport+Road+Bangalore&t=k&layer=t' },
    { id: 106, name: 'Medanta - The Medicity', location: 'Gurugram, Haryana', type: 'Hospital', specialty: 'Heart & Multi-specialty', mapUrl: 'https://www.google.com/maps/search/Medanta+Gurugram&t=k&layer=t' },
    { id: 107, name: 'CMC Vellore', location: 'Vellore, Tamil Nadu', type: 'Hospital', specialty: 'Tertiary Care', mapUrl: 'https://www.google.com/maps/search/CMC+Vellore&t=k&layer=t' },
    { id: 108, name: 'Max Super Specialty', location: 'Saket, New Delhi', type: 'Hospital', specialty: 'Multi-specialty', mapUrl: 'https://www.google.com/maps/search/Max+Super+Specialty+Saket&t=k&layer=t' },
    { id: 109, name: 'AIG Hospitals', location: 'Gachibowli, Hyderabad', type: 'Hospital', specialty: 'Gastroenterology & Multi-specialty', mapUrl: 'https://www.google.com/maps/search/AIG+Hospitals+Hyderabad&t=k&layer=t' },
    { id: 110, name: 'Aster Medcity', location: 'Kochi, Kerala', type: 'Hospital', specialty: 'Quaternary Healthcare', mapUrl: 'https://www.google.com/maps/search/Aster+Medcity+Kochi&t=k&layer=t' },
    { id: 111, name: 'KIMS Health', location: 'Trivandrum, Kerala', type: 'Hospital', specialty: 'Multi-specialty', mapUrl: 'https://www.google.com/maps/search/KIMS+Health+Trivandrum&t=k&layer=t' },
    { id: 112, name: 'NIMHANS', location: 'Bengaluru, Karnataka', type: 'Hospital', specialty: 'Mental Health & Neuroscience', mapUrl: 'https://www.google.com/maps/search/NIMHANS+Bangalore&t=k&layer=t' },
    { id: 113, name: 'Kauvery Hospital', location: 'Alwarpet, Chennai', type: 'Hospital', specialty: 'Multi-specialty', mapUrl: 'https://www.google.com/maps/search/Kauvery+Hospital+Chennai&t=k&layer=t' },
    { id: 114, name: 'Narayana Health City', location: 'Bommasandra, Bengaluru', type: 'Hospital', specialty: 'Cardiac Sciences', mapUrl: 'https://www.google.com/maps/search/Narayana+Health+City+Bangalore&t=k&layer=t' },
    { id: 115, name: 'Global Hospitals', location: 'Perumbakkam, Chennai', type: 'Hospital', specialty: 'Organ Transplant', mapUrl: 'https://www.google.com/maps/search/Global+Hospitals+Chennai&t=k&layer=t' },
    { id: 116, name: 'MIOT International', location: 'Manapakkam, Chennai', type: 'Hospital', specialty: 'Orthopaedics & Trauma', mapUrl: 'https://www.google.com/maps/search/MIOT+International+Chennai&t=k&layer=t' },
    { id: 117, name: 'MGM Healthcare', location: 'Chennai, Tamil Nadu', type: 'Hospital', specialty: 'Advanced Multi-specialty', mapUrl: 'https://www.google.com/maps/search/MGM+Healthcare+Chennai&t=k&layer=t' },
    { id: 118, name: 'Rainbow Children Hospital', location: 'Hyderabad, Telangana', type: 'Hospital', specialty: 'Pediatrics', mapUrl: 'https://www.google.com/maps/search/Rainbow+Children+Hospital+Hyderabad&t=k&layer=t' },
    { id: 119, name: 'Amrita Hospital', location: 'Kochi, Kerala', type: 'Hospital', specialty: 'Multi-specialty Research', mapUrl: 'https://www.google.com/maps/search/Amrita+Hospital+Kochi&t=k&layer=t' }
];

const Hero = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [searching, setSearching] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Click outside to close results
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced Search Effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 2) {
                setSearching(true);
                setShowResults(true);

                try {
                    // 1. Search Medicines (Local Mock Data)
                    const filteredMed = medicines.filter(m =>
                        m.name.toLowerCase().includes(query.toLowerCase()) ||
                        m.use.toLowerCase().includes(query.toLowerCase())
                    );

                    // 2. Search Hospitals (OpenStreetMap API)
                    // We search for nodes with amenity=hospital in India matching the query
                    const osmRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' hospital india')}&limit=10`);
                    const osmData = await osmRes.json();

                    const filteredHosp = osmData.map((h: any) => ({
                        id: h.place_id,
                        name: h.display_name.split(',')[0],
                        location: h.display_name.split(',').slice(1, 4).join(', '),
                        type: 'Hospital',
                        specialty: 'Medical Facility',
                        mapUrl: `https://www.google.com/maps/search/${encodeURIComponent(h.display_name)}&t=k&layer=t`
                    }));

                    setResults([...filteredMed, ...filteredHosp]);
                } catch (error) {
                    console.error('Search error:', error);
                    // Fallback to local filter if API fails
                    const filteredHosp = hospitals.filter(h =>
                        h.name.toLowerCase().includes(query.toLowerCase()) ||
                        h.location.toLowerCase().includes(query.toLowerCase())
                    );
                    setResults([...medicines.filter(m => m.name.toLowerCase().includes(query.toLowerCase())), ...filteredHosp]);
                } finally {
                    setSearching(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleItemClick = (item: any) => {
        if (item.type === 'Medicine') {
            window.open(item.buyUrl, '_blank');
        } else if (item.type === 'Hospital') {
            window.open(item.mapUrl, '_blank');
        }
    };

    return (
        <section className="relative w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white dark:from-zinc-900 dark:to-black overflow-hidden py-16">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl opacity-50 animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-teal-400/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center gap-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                    Your Health, Our Priority
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                    Healthcare Made <br />
                    <span className="text-blue-600">Simpler & Better</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                    Book appointments, search medicines, and find every hospital in India accurately - all in one place.
                </p>

                <div className="w-full max-w-lg mt-8 relative" ref={searchRef}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-2 ring-1 ring-gray-200 dark:ring-gray-800">
                        <div className="pl-3 text-gray-400">
                            {searching ? (
                                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </div>
                        <input
                            type="text"
                            suppressHydrationWarning={true}
                            value={query}
                            onChange={handleSearchChange}
                            onFocus={() => query.length > 2 && setShowResults(true)}
                            placeholder="Locate any hospital or search medicines..."
                            className="flex-1 bg-transparent border-none outline-none px-4 text-gray-900 dark:text-white placeholder-gray-400 h-10"
                        />
                        <button
                            suppressHydrationWarning={true}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md"
                        >
                            Search
                        </button>
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && results.length > 0 && (
                        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto text-left">
                            <div className="p-2">
                                {results.map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        onClick={() => handleItemClick(item)}
                                        className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg cursor-pointer transition-colors border-b border-gray-50 dark:border-zinc-800 last:border-0"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${item.type === 'Medicine' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                                        {item.type}
                                                    </span>
                                                    <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm line-clamp-1">{item.name}</h4>
                                                </div>
                                                {item.type === 'Medicine' ? (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                                        <span className="font-medium text-blue-600 dark:text-blue-400">Use:</span> {item.use}
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                        <span className="font-medium text-blue-600 dark:text-blue-400">Place:</span> {item.location}
                                                    </p>
                                                )}
                                            </div>
                                            {item.type === 'Medicine' && (
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.price}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">Click to Buy</p>
                                                </div>
                                            )}
                                            {item.type === 'Hospital' && (
                                                <div className="text-right shrink-0">
                                                    <p className="text-[10px] text-blue-600 font-bold uppercase">View Map</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {showResults && !searching && results.length === 0 && query.length > 2 && (
                        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-2xl z-50 p-6 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
                            <p className="text-xs text-gray-400 mt-1">Try city names or hospital chains like "Apollo"</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mt-12 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Top Indian Hospitals
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Medicine Prices (INR)
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Medical Use Cases
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
