'use client';

import React, { useState } from 'react';
import { PublicService } from '@/types';
import { OFFICIAL_SERVICES } from '@/lib/services-data';
import { Search, MapPin, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CountiesViewProps {
  onSelectService: (service: PublicService) => void;
  onBackToHome: () => void;
}

interface CountyEntry {
  code: string;
  name: string;
  headquarters: string;
  region: string;
}

const ALL_COUNTIES: CountyEntry[] = [
  { code: '001', name: 'Mombasa County', headquarters: 'Mombasa (Treasury Square)', region: 'Coast' },
  { code: '002', name: 'Kwale County', headquarters: 'Kwale', region: 'Coast' },
  { code: '003', name: 'Kilifi County', headquarters: 'Kilifi', region: 'Coast' },
  { code: '004', name: 'Tana River County', headquarters: 'Hola', region: 'Coast' },
  { code: '005', name: 'Lamu County', headquarters: 'Lamu Town', region: 'Coast' },
  { code: '006', name: 'Taita Taveta County', headquarters: 'Mwatate', region: 'Coast' },
  { code: '007', name: 'Garissa County', headquarters: 'Garissa', region: 'North Eastern' },
  { code: '008', name: 'Wajir County', headquarters: 'Wajir', region: 'North Eastern' },
  { code: '009', name: 'Mandera County', headquarters: 'Mandera', region: 'North Eastern' },
  { code: '010', name: 'Marsabit County', headquarters: 'Marsabit', region: 'Eastern' },
  { code: '011', name: 'Isiolo County', headquarters: 'Isiolo', region: 'Eastern' },
  { code: '012', name: 'Meru County', headquarters: 'Meru', region: 'Eastern' },
  { code: '013', name: 'Tharaka Nithi County', headquarters: 'Kathwana', region: 'Eastern' },
  { code: '014', name: 'Embu County', headquarters: 'Embu', region: 'Eastern' },
  { code: '015', name: 'Kitui County', headquarters: 'Kitui', region: 'Eastern' },
  { code: '016', name: 'Machakos County', headquarters: 'Machakos (White House)', region: 'Eastern' },
  { code: '017', name: 'Makueni County', headquarters: 'Wote', region: 'Eastern' },
  { code: '018', name: 'Nyandarua County', headquarters: 'Ol Kalou', region: 'Central' },
  { code: '019', name: 'Nyeri County', headquarters: 'Nyeri', region: 'Central' },
  { code: '020', name: 'Kirinyaga County', headquarters: 'Kerugoya', region: 'Central' },
  { code: '021', name: 'Murang\'a County', headquarters: 'Murang\'a', region: 'Central' },
  { code: '022', name: 'Kiambu County', headquarters: 'Kiambu / Thika', region: 'Central' },
  { code: '023', name: 'Turkana County', headquarters: 'Lodwar', region: 'Rift Valley' },
  { code: '024', name: 'West Pokot County', headquarters: 'Kapenguria', region: 'Rift Valley' },
  { code: '025', name: 'Samburu County', headquarters: 'Maralal', region: 'Rift Valley' },
  { code: '026', name: 'Trans Nzoia County', headquarters: 'Kitale', region: 'Rift Valley' },
  { code: '027', name: 'Uasin Gishu County', headquarters: 'Eldoret City', region: 'Rift Valley' },
  { code: '028', name: 'Elgeyo Marakwet County', headquarters: 'Iten', region: 'Rift Valley' },
  { code: '029', name: 'Nandi County', headquarters: 'Kapsabet', region: 'Rift Valley' },
  { code: '030', name: 'Baringo County', headquarters: 'Kabarnet', region: 'Rift Valley' },
  { code: '031', name: 'Laikipia County', headquarters: 'Rumuruti / Nanyuki', region: 'Rift Valley' },
  { code: '032', name: 'Nakuru County', headquarters: 'Nakuru City', region: 'Rift Valley' },
  { code: '033', name: 'Narok County', headquarters: 'Narok', region: 'Rift Valley' },
  { code: '034', name: 'Kajiado County', headquarters: 'Kajiado', region: 'Rift Valley' },
  { code: '035', name: 'Kericho County', headquarters: 'Kericho', region: 'Rift Valley' },
  { code: '036', name: 'Bomet County', headquarters: 'Bomet', region: 'Rift Valley' },
  { code: '037', name: 'Kakamega County', headquarters: 'Kakamega', region: 'Western' },
  { code: '038', name: 'Vihiga County', headquarters: 'Mbale', region: 'Western' },
  { code: '039', name: 'Bungoma County', headquarters: 'Bungoma', region: 'Western' },
  { code: '040', name: 'Busia County', headquarters: 'Busia', region: 'Western' },
  { code: '041', name: 'Siaya County', headquarters: 'Siaya', region: 'Nyanza' },
  { code: '042', name: 'Kisumu County', headquarters: 'Kisumu City (Prosperity House)', region: 'Nyanza' },
  { code: '043', name: 'Homa Bay County', headquarters: 'Homa Bay', region: 'Nyanza' },
  { code: '044', name: 'Migori County', headquarters: 'Migori', region: 'Nyanza' },
  { code: '045', name: 'Kisii County', headquarters: 'Kisii', region: 'Nyanza' },
  { code: '046', name: 'Nyamira County', headquarters: 'Nyamira', region: 'Nyanza' },
  { code: '047', name: 'Nairobi City County', headquarters: 'Nairobi (City Hall)', region: 'Nairobi' }
];

export default function CountiesView({
  onSelectService,
  onBackToHome
}: CountiesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const regions = ['ALL', 'Nairobi', 'Central', 'Coast', 'Eastern', 'Rift Valley', 'Western', 'Nyanza', 'North Eastern'];

  const filtered = ALL_COUNTIES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.includes(searchTerm) ||
      c.headquarters.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'ALL' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleApplyCountyService = () => {
    const businessService = OFFICIAL_SERVICES.find((s) => s.id === 'brs-business-name');
    if (businessService) {
      onSelectService(businessService);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-lexend">
      <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <button onClick={onBackToHome} className="hover:text-gray-900 font-medium">
            Home
          </button>
          <span>/</span>
          <span className="text-gray-900 font-semibold">County Governments</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src="/coat-of-arms-kenya.svg"
                  alt="Republic of Kenya Coat of Arms"
                  className="h-10 w-auto object-contain"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#008751]">
                  Devolved Governance
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                47 County Governments of Kenya
              </h1>
              <p className="text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">
                Apply for devolved public services including Single Business Permits (SBP), County Land Rates, Parking fees, and Public Health clearances unified under the eCitizen platform.
              </p>
            </div>

            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search county name or code (e.g. 047)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#008751]"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="text-gray-500 font-medium shrink-0 mr-1">Region:</span>
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-2xl font-medium shrink-0 transition-colors ${
                  selectedRegion === reg
                    ? 'bg-[#008751] text-white font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((county) => (
            <div
              key={county.code}
              className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#008751]/10 text-[#008751] flex items-center justify-center font-bold text-sm">
                    {county.code}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                    {county.region}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {county.name}
                </h3>

                <div className="flex items-center space-x-1.5 text-xs text-gray-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>HQ: {county.headquarters}</span>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-1.5 mb-5 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008751] shrink-0" />
                    <span>Single Business Permit (SBP)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008751] shrink-0" />
                    <span>County Land Rates Clearance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008751] shrink-0" />
                    <span>Daily &amp; Seasonal Parking</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyCountyService}
                className="w-full py-2.5 px-4 rounded-2xl border border-gray-200 hover:border-[#008751] text-gray-900 hover:text-[#008751] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Apply for County Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
