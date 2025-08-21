import {
    Calendar,
    Cloud,
    CloudRain,
    Sun,
    CloudSnowIcon as Snow,
    Wind,
    Droplets
} from 'lucide-react';


export default function AllDayForecast({data}){
    const getWeatherIcon = (condition) => {
            switch (condition.toLowerCase()) {
                case 'clear':
                    return Sun;
                case 'clouds':
                    return Cloud;
                case 'rain':
                    return CloudRain;
                case 'snow':
                    return Snow;
                default:
                    return Sun
        }
    }
    const displayData = data && data.length > 0 ? data : [{
        day: "",
        date: new Date(),
        high: 0,
        low: 0,
        condition: "Clear",
        description: "Loading...",
        precipitation: 0,
        humidity: 0,
        wind: 0,
    }];

    return(
        <div className='rounded-xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl p-4 sm:p-6'>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Calendar className='h-5 w-5 text-white'/>
                <h2 className='text-white text-lg sm:text-2xl extra'>Daily Forecast</h2>
            </div>
            <div className=' space-y-3'>
                {displayData.map((day,index) =>{
                    const Icomponent = getWeatherIcon(day.condition);
                    return(
                        <div key={index} className='flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 border border-white/20 hover:scale-[1.02] group cursor-pointer'>
                            <div className='flex items-center gap-2 flex-1 min-w-[150px]'>
                                <Icomponent className='h-8 w-8 sm:h-10 sm:w-10 text-blue-500 group-hover:scale-110 transition-transform flex-shrink-0 drop-shadow-lg'/>
                                <div className='min-w-0'>
                                    <span className='block text-white font-bold truncate text-base sm:text-lg drop-shadow-sm extra' >{day.day}</span>
                                    <span className='block text-white/80 capitalize text-xs sm:text-sm font-medium extra truncate'>{day.date.toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className='flex flex-wrap items-center gap-4 text-xs sm:text-sm '>
                                <div className='flex items-center gap-1 text-blue-300'>
                                    <Droplets className='h-3 w-3'/>
                                    <span className='font-medium extra'>{day.precipitation}%</span>
                                </div>
                                <div className='flex items-center gap-1 text-green-500'>
                                    <Wind className='h-4 w-4'/>
                                    <span className='font-medium extra'>{day.wind}m/s</span>
                                </div>
                                <div className="text-xs extra text-white/70 font-medium">
                                    {day.humidity}%
                                </div>
                                <div className='text-right'>
                                    <span className='text-lg extra sm:text-xl font-bold text-white drop-shadow-sm'>{day.high}</span>
                                    <span className='ml-2 extra text-white/70 text-base sm:text-lg'>{day.low}°</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

}



