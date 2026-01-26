import { LucideIcon } from "lucide-react";
import "./stats.css";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export default function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
  return (
    <div className="metric-card">
      {/* Icon and Value - Horizontal */}
      <div className="metric-content">
        <div className="metric-right-section">
          {/* Icon WITH green background box */}
          <div className="metric-icon-box">
            <Icon className="metric-card-icon" />
          </div>
          <p className="metric-card-value">
            {value}
          </p>
        </div>
      </div>
      
      {/* Label */}
      <p className="metric-card-label">
        {label}
      </p>
    </div>
  );
}

