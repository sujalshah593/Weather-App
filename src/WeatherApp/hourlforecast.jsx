import {
    Clock,
    Cloud,
    CloudRain,
    Sun,
    Wind,
    Droplets
} from 'lucide-react';

export default function HourForecast({data}) {

    const WeatherIcon = (condition) => {
        switch (condition.toLowerCase()) {
                case 'clear':
                    return Sun;
                case 'clouds':
                    return Cloud;
                case 'rain':
                    return CloudRain;
                default:
                    return Sun;
        }
    }

    const displayData = data.length > 0 ? data : [{
        time: "Loading...",
        condition: "Clear",
        temp: 0,
        description: "Loading...",
        humidity: 0,
        wind: 0,
    }]

    return (
        <div className='rounded-xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl p-6'>
            <div className='flex items-center gap-3 mb-6'>
                <Clock className='h-6 w-6 text-white' />
                <span className='text-white text-xl font-semibold extra'>Hour Forecast</span>
            </div>
            <div className='flex gap-4 overflow-x-auto pb-4'>
                {displayData.map((hour,index) => {
                    const IconComponent = WeatherIcon(hour.condition);
                    return (
                        <div key={index} className='flex-shrink-0 text-center p-6 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 cursor-pointer group min-w-[140px] hover:scale-105 border border-white/20'>
                            <p className='text-white/90  text-sm font-semibold mb-3 extra'>{hour.temp}°C</p>
                            <IconComponent className='h-8 w-8 mx-auto mb-3 extra text-white drop-shadow-lg group-hover:scale-110 transition-transform' />
                            <p className=' text-2xl text-white mb-2 extra drop-shadow-lg font-bold'>{hour.time}</p>
                            <p className='text-white/80 text-xs extra mb-3 font-medium capitalize'>{hour.description}</p>
                            <div className='flex items-center justify-center gap-1 text-xs text-white/70'>
                                <Wind className='h-3 w-3' />
                                <span className='extra'>{hour.wind} m/s</span>
                                <div className='flex items-center justify-center gap-1 text-xs text-white/70 '>
                                    <Droplets className='h-3 w-3' />
                                    <span className='extra'>{hour.humidity}%</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

}