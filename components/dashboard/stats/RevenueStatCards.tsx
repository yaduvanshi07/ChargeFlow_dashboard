"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import StatsCard from "./StatsCard";
import { moneyAPI, chargersAPI, formatCurrency } from "@/lib/api";

// Custom hook for API data with auto-refresh and error handling
function useApiData(apiCall: () => Promise<any>, dependencies: any[] = [], refreshInterval: number | null = null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error('API Error:', err);

      // Handle rate limiting specifically
      if (err.message?.includes('Too many requests') || err.status === 429) {
        setError('Rate limit exceeded. Retrying with longer interval...');
        // Increase retry count and extend interval
        setRetryCount(prev => prev + 1);

        // Don't retry immediately, wait longer based on retry count
        if (retryCount >= 2) {
          setError('Please refresh the page to try again');
          return;
        }
      } else {
        setError(err.message || 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Adjust refresh interval based on retry count
    let adjustedInterval = refreshInterval;
    if (retryCount > 0) {
      adjustedInterval = (refreshInterval || 30000) * (retryCount + 1); // Exponential backoff
    }

    if (adjustedInterval && adjustedInterval > 0) {
      const interval = setInterval(fetchData, adjustedInterval);
      return () => clearInterval(interval);
    }
  }, [...dependencies, retryCount]);

  return { data, loading, error, refetch: fetchData, retryCount };
}

export default function RevenueStatCards() {
  // Use the custom hook for auto-refreshing data with longer intervals
  const { data: totalRevenue, loading: totalLoading, error: totalError, refetch: refetchRevenue } = useApiData(
    () => moneyAPI.getTotalRevenue(),
    [],
    30000 // Refresh every 30 seconds instead of 5
  );

  const { data: activeChargersData, loading: activeLoading, refetch: refetchChargers } = useApiData(
    () => chargersAPI.getActiveChargers(),
    [],
    60000 // Refresh every 1 minute for chargers (less frequent)
  );

  const { data: totalSessionsData, loading: sessionsLoading, refetch: refetchSessions } = useApiData(
    () => chargersAPI.getTotalSessions(),
    [],
    60000 // Refresh every 1 minute for sessions
  );

  // Manual refresh function
  const handleManualRefresh = () => {
    refetchRevenue();
    refetchChargers();
    refetchSessions();
  };

  // Listen for booking verification events to refresh dashboard
  useEffect(() => {
    const handleBookingVerified = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('🔄 Booking verified event received:', customEvent.detail);
      console.log('🔄 Refreshing dashboard stats...');

      // Refresh all stats immediately
      refetchRevenue();
      refetchChargers();
      refetchSessions();

      // Also refresh after a short delay to ensure backend is updated
      setTimeout(() => {
        console.log('🔄 Second refresh to ensure latest data...');
        refetchRevenue();
        refetchChargers();
        refetchSessions();
      }, 1000);
    };

    // Listen for booking accepted events
    const handleBookingAccepted = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('🔄 Booking accepted event received:', customEvent.detail);
      console.log('🔄 Refreshing charger stats...');

      // Refresh chargers and sessions (accepting a booking may activate a charger)
      refetchChargers();
      refetchSessions();
    };

    // Listen for session completion events
    const handleSessionCompleted = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('🔄 Session completed event received:', customEvent.detail);
      console.log('🔄 Refreshing revenue and session stats...');

      // Refresh revenue and sessions (session completion affects both)
      refetchRevenue();
      refetchSessions();

      // Session completion may also change charger status
      setTimeout(() => {
        refetchChargers();
      }, 500);
    };

    // Listen for charger status changes
    const handleChargerStatusChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('🔄 Charger status changed event received:', customEvent.detail);
      console.log('🔄 Refreshing charger stats...');

      // Refresh charger stats immediately
      refetchChargers();
    };

    // Add all event listeners
    window.addEventListener('booking-verified', handleBookingVerified);
    window.addEventListener('booking-accepted', handleBookingAccepted);
    window.addEventListener('session-completed', handleSessionCompleted);
    window.addEventListener('charger-status-changed', handleChargerStatusChanged);

    return () => {
      // Clean up all event listeners
      window.removeEventListener('booking-verified', handleBookingVerified);
      window.removeEventListener('booking-accepted', handleBookingAccepted);
      window.removeEventListener('session-completed', handleSessionCompleted);
      window.removeEventListener('charger-status-changed', handleChargerStatusChanged);
    };
  }, [refetchRevenue, refetchChargers, refetchSessions]);

  // Check if any API has rate limit error
  const hasRateLimitError = totalError?.includes('Rate limit') ||
    activeChargersData?.error?.includes('Rate limit') ||
    totalSessionsData?.error?.includes('Rate limit');

  // Calculate percentage changes (mock data for now)
  const calculateChange = (current: number | null, previous: number) => {
    if (!current) return { value: "0%", isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
      isPositive: change >= 0
    };
  };

  // Handle loading states
  const hasError = totalError && !hasRateLimitError;

  if (hasError) {
    return (
      <div className="col-span-4 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-600">
          <Icon icon="material-symbols:error" />
          <span>Failed to load dashboard data. Please check your connection.</span>
        </div>
      </div>
    );
  }

  // Show rate limit warning with refresh button
  if (hasRateLimitError) {
    return (
      <div className="col-span-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-600">
            <Icon icon="material-symbols:warning" />
            <span>API rate limit reached. Data will refresh automatically.</span>
          </div>
          <button
            onClick={handleManualRefresh}
            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Refresh Now
          </button>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Revenue",
      value: totalRevenue ? formatCurrency(totalRevenue.total) : "₹0",
      change: calculateChange(totalRevenue?.total || null, 40000), // Mock previous value
      icon: "fluent:arrow-growth-24-filled",
      loading: totalLoading
    },
    {
      title: "Active Chargers",
      value: activeChargersData ? activeChargersData.activeChargers.toString() : "0",
      subtitle: "All Online",
      icon: "material-symbols:ev-charger-rounded",
      loading: activeLoading
    },
    {
      title: "Total Sessions",
      value: totalSessionsData ? totalSessionsData.totalSessions.toString() : "0",
      change: { value: "12 This Week", isPositive: false },
      icon: "bxs:calendar-check",
      loading: sessionsLoading
    }
  ];

  return (
    <>
      {statsData.map((stat, index) => (
        <div key={index} className="relative">
          <StatsCard
            title={stat.title}
            value={stat.loading ? "Loading..." : stat.value}
            change={stat.change}
            subtitle={stat.subtitle}
            icon={stat.icon}
          />
          {stat.loading && (
            <div className="absolute top-2 right-2">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
