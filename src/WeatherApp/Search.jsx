import {useState} from 'react';
import {
    MapPin,
    Search,
    X,
    Star
} from 'lucide-react';

const recentSearches = ["New Delhi", "Mumbai", "Ahemdabad", "Vadodara", "Surat"];
const favorites = ["Gandhinagar", "Goa", "Bangalore","Chennai"];

export default function LocSearch({onLoactionSelect, loading}) {
    const [query, setquery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestions = ["New Delhi", "Mumbai", "Vadodara","Ahemdabad","Gandhinagar"].filter((city)=>city.toLowerCase().includes(query.toLowerCase()))

    const OnSearch = () => {
        if(query.trim()) {
            onLoactionSelect(query);
            setquery("");
            setShowSuggestions(false);
        }
    }

    return(
        <div className='relative'>
            <div className='flex gap-2 mb-4'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4'/>
                 <input type="text" value={query} onChange={(e) => { setquery(e.target.value) ,setShowSuggestions(true)}} onKeyDown={(e) => e.key === "Enter" && OnSearch()} placeholder="Search for a city..." className="w-full extra pl-10 pr-8 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                 {query && (
                    <button className='absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600' onClick={() => {setquery(""), setShowSuggestions(false)}}>
                        <X className='h-4 w-4' />
                    </button>
                 )}
                </div>
                <button onClick={OnSearch} disabled={loading || !query.trim()} className='bg-blue-500 extra text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 disabled:opacity-50'>{loading ? "Searching...": "Search"}</button>
            </div>
            {showSuggestions && query && suggestions.length > 0 && (
                <div>
                    {suggestions.map((suggestion, index) => (
                        <button key={index} className='w-full extra text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2' onClick={()=>{ onLoactionSelect(suggestion) ,setquery(""), setShowSuggestions(false)}}><MapPin className='w-4 h-4 text-slate-400'/></button>
                    ))}
                </div>
            )}
            <div className='space-y-4 mt-4'>
                <div>
                    <h4 className='text-sm extra font-medium text-slate-600 mb-2 flex items-center gap-2'><Star className='h-4 w-4'/>Favorites</h4>
                    <div className='flex flex-wrap gap-2'>
                        {favorites.map((location, index)=>(
                            <button key={index} className='extra' onClick={()=>onLoactionSelect(location)}>{location}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className='text-sm extra font-medium text-slate-600 mb-2'>Recent Locations which you Search</h4>
                    <div>
                        {recentSearches.map((location, index)=>(
                            <button key={index} onClick={()=>onLoactionSelect(location)} className='extra text-xs px-3 py-1 hover:text-slate-700 rounded-md hover:bg-slate-100 gap-2'>
                                {location}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}