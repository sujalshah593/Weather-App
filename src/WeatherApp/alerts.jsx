import { AlertTriangle, Info, Zap, Wind, Droplets, Eye } from "lucide-react";

export default function Alerts({ alerts }) {
  const getAlertIcon = (nameoficon) => {
    switch (nameoficon) {
      case "Eye":
        return Eye;
      case "Zap":
        return Zap;
      case "wind":
        return Wind;
      case "Droplets":
        return Droplets;
      default:
        return Info;
    }
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className="rounded-xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-6 w-6 text-white" />
          <h2 className="text-white text-xl font-semibold extra">Alerts</h2>
        </div>
        <div className="text-center py-12 text-white/80">
          <Info className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium extra">No alerts on this location</p>
          <p className="text-sm mt-2 extra">Weather is currently normal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle />
        <h2 className="text-white text-xl font-semibold extra">
          Alerts ({alerts.length})
        </h2>
      </div>
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const IconComponent = getAlertIcon(alert.icon);
          return (
            <div
              key={index}
              className="p-6 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-400/30 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <IconComponent className="h-8 w-8  flex-shrink-0 text-red-300" />
                <div>
                  <h3 className="text-white font-bold extra mb-2 text-lg">{alert.title}</h3>
                  <p className="text-white/90 extra font-medium">
                    {alert.description}
                  </p> 
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
