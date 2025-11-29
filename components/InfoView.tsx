import React, { useEffect, useState } from 'react';
import { BeachGroup, StatusLevel } from '../types';
import { getCountySummary } from '../services/geminiService';
import { Info, AlertTriangle, Droplets, MapPin, ExternalLink, Sparkles } from 'lucide-react';

interface Props {
  beaches: BeachGroup[];
}

export const InfoView: React.FC<Props> = ({ beaches }) => {
  const [summary, setSummary] = useState<string>("Analyzing county-wide data...");

  useEffect(() => {
    const fetchSummary = async () => {
      if (beaches.length > 0) {
        const result = await getCountySummary(beaches);
        setSummary(result);
      }
    };
    fetchSummary();
  }, [beaches]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
      
      {/* AI Summary Section */}
      <section className="bg-black text-white p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4 text-purple-300">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-bold text-sm tracking-widest uppercase">30-Day County Summary</h2>
        </div>
        <p className="text-lg md:text-xl font-medium leading-relaxed">
          "{summary}"
        </p>
      </section>

      {/* Educational Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Why Enterococcus */}
        <div className="bg-neutral-50 p-6 border border-neutral-200">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <Info className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wide text-sm">The Pollutant: Enterococcus</h3>
          </div>
          <p className="text-sm leading-relaxed text-neutral-600 mb-4">
            Enterococcus is a bacteria found in the gut of warm-blooded animals. It is used as the federal standard for ocean water quality because it survives in saltwater longer than E. coli and correlates strongly with swimming-associated illness.
          </p>
          <div className="text-xs bg-white p-3 border border-neutral-100 font-mono">
            <strong>SAFE:</strong> &lt; 104 MPN/100ml<br/>
            <strong>DANGER:</strong> &gt; 104 MPN/100ml
          </div>
        </div>

        {/* Sources */}
        <div className="bg-neutral-50 p-6 border border-neutral-200">
           <div className="flex items-center gap-2 mb-4 text-orange-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wide text-sm">Major Sources</h3>
          </div>
          <ul className="space-y-3 text-sm text-neutral-600">
            <li className="flex gap-2">
              <span className="font-bold text-black w-24 shrink-0">TJ River:</span>
              <span>Primary source for Imperial Beach. Cross-border sewage infrastructure failures cause massive closures.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-black w-24 shrink-0">Rain Runoff:</span>
              <span>Washes urban trash, oil, and bacteria into the ocean. "72-Hour Rule" applies after storms.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-black w-24 shrink-0">Wildlife:</span>
              <span>La Jolla Cove & Children's Pool often fail due to the high population of seals and sea lions.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-black w-24 shrink-0">Stagnation:</span>
              <span>Enclosed areas like Mission Bay (De Anza Cove) lack tidal flushing, trapping bacteria.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Data Table */}
      <section>
        <div className="flex justify-between items-end mb-6 border-b border-black pb-2">
           <h2 className="text-3xl font-black uppercase tracking-tight">Full Data Table</h2>
           <a 
             href="http://www.sdbeachinfo.com/" 
             target="_blank"
             rel="noreferrer"
             className="text-xs font-mono flex items-center gap-1 hover:underline"
           >
             SOURCE: DEHQ <ExternalLink className="w-3 h-3" />
           </a>
        </div>
        
        <div className="overflow-x-auto border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-100 text-neutral-500 font-mono text-xs uppercase">
              <tr>
                <th className="p-4 border-b">Beach Name</th>
                <th className="p-4 border-b">Region</th>
                <th className="p-4 border-b">Safety Status</th>
                <th className="p-4 border-b hidden md:table-cell">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {beaches.map((beach) => (
                <tr key={beach.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-4 font-bold">{beach.name}</td>
                  <td className="p-4 text-neutral-500 text-xs uppercase tracking-wider">{beach.region}</td>
                  <td className="p-4 font-mono font-bold">
                    <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${beach.currentStatus === StatusLevel.SAFE ? 'bg-green-100 text-green-700' : ''}
                      ${beach.currentStatus === StatusLevel.WARNING ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${beach.currentStatus === StatusLevel.DANGER ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {beach.currentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-400 font-mono text-xs hidden md:table-cell">
                    {new Date(beach.lastUpdated).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};