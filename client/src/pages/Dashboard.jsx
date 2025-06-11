import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Star,
  Activity,
  Calendar,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown,
} from "lucide-react";

import { dashboardAPI } from "../services/api";
import { useApi } from "../hooks/useApi";
import LoadingSpinner from "./Component/LoadingSpinner";
import Barcharts from "./Component/Barcharts";
import Piechart from "./Component/Piechart";
import Areachart from "./Component/Areachart";

const Dashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("1months");
  const [activeTab, setActiveTab] = useState("overview");
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useApi(dashboardAPI.getStats);
  const {
    data: complaintsByCity,
    loading: cityLoading,
    error: cityError,
    refetch: refetchCity,
  } = useApi(dashboardAPI.getComplaintsByCity);
  const {
    data: complaintsByCategory,
    loading: categoryLoading,
    error: categoryError,
    refetch: refetchCategory,
  } = useApi(dashboardAPI.getComplaintsByCategory);
  const {
    data: departmentRatings,
    loading: ratingsLoading,
    error: ratingsError,
    refetch: refetchRatings,
  } = useApi(dashboardAPI.getDepartmentRatings);
  const {
    data: monthlyTrends,
    loading: trendsLoading,
    error: trendsError,
    refetch: refetchTrends,
  } = useApi(dashboardAPI.getMonthlyTrends);
  const {
    data: recentComplaints,
    loading: recentLoading,
    error: recentError,
    refetch: refetchRecent,
  } = useApi(() => dashboardAPI.getRecentComplaints(10));

  const statCards = [
    {
      title: "Total Complaints",
      value: stats?.total_complaints || "0",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Pending",
      value: stats?.pending_complaints || "0",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      change: "-5%",
      changeType: "decrease",
    },
    {
      title: "Resolved",
      value: stats?.resolved_complaints || "0",
      icon: CheckCircle,
      color: "from-emerald-500 to-green-600",
      change: "+18%",
      changeType: "increase",
    },
    {
      title: "Citizens",
      value: stats?.total_citizens || "0",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      change: "+25%",
      changeType: "increase",
    },
    {
      title: "Avg Rating",
      value: stats?.average_rating || "0.0",
      icon: Star,
      color: "from-indigo-500 to-indigo-600",
      change: "+0.3",
      changeType: "increase",
    },
    {
      title: "Active Departments",
      value: stats?.active_departments || "0",
      icon: TrendingUp,
      color: "from-teal-500 to-cyan-600",
      change: "+2",
      changeType: "increase",
    },
    {
      title: "Resolution Rate",
      value: stats
        ? `${Math.round(
            (stats.resolved_complaints / stats.total_complaints) * 100
          )}%`
        : "0%",
      icon: Activity,
      color: "from-pink-500 to-rose-600",
      change: "+2.1%",
      changeType: "increase",
    },
  ];

  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "analytics", name: "Analytics", icon: PieChartIcon },
    { id: "performance", name: "Performance", icon: TrendingUp },
  ];

    const pieChartData = complaintsByCategory?.map((item) => ({
        ...item,
        complaint_count: Number(item.complaint_count)
    }))

  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        refetchStats(),
        refetchCity(),
        refetchCategory(),
        refetchRatings(),
        refetchTrends(),
        refetchRecent(),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <div className="col-span-full">
            <LoadingSpinner text="Loading statistics..." />
          </div>
        ) : statsError ? (
          <div className="col-span-full">
            <p>Something went wrong try again</p>
          </div>
        ) : (
          statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`bg-gradient-to-r ${card.color} p-3 rounded-xl shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-sm font-medium ${
                      card.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                    {card.changeType === "increase" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{card.change}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {card.value}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {card.title}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Complaints by City
            </h3>
            <button
              onClick={refetchCity}
              className="text-blue-600 hover:text-blue-800 transition-colors">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          {cityLoading ? (
            <LoadingSpinner size="lg" text="Loading city data..." />
          ) : cityError ? (
            <p>Something went wrong Try again</p>
          ) : (
          <Barcharts complaintsByCity={complaintsByCity}/>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Complaints by Category
            </h3>
            <button
              onClick={refetchCategory}
              className="text-blue-600 hover:text-blue-800 transition-colors">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          {categoryLoading ? (
            <LoadingSpinner text="Loading category data..." />
          ) : categoryError ? (
            <p>Something went wrong. Try again.</p>
          ) : (
            
             
                
                <div>
                    <Piechart complaintsByCategory={pieChartData}/>

                  
                    </div>
                )
                
           
            }
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Recent Complaints
          </h3>
          <button
            onClick={refetchRecent}
            className="text-blue-600 hover:text-blue-800 transition-colors">
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        {recentLoading ? (
          <LoadingSpinner text="Loading recent complaints..." />
        ) : recentError ? (
          <p>Something went wrong Try again</p>
        ) : (
          <div className="space-y-4">
            {recentComplaints?.map((complaint) => (
              <div
                key={complaint.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {complaint.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{complaint.citizen_name}</span>
                    <span>{complaint.city_name}</span>
                    <span>{complaint.category_name}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      complaint.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : complaint.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                    {complaint.status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      complaint.priority >= 4
                        ? "bg-red-100 text-red-800"
                        : complaint.priority === 3
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                    Priority{" "}
                    {complaint.priority === 1
                      ? "Low"
                      : complaint.priority === 2
                      ? "Medium"
                      : complaint.priority === 3
                      ? "High"
                      : "Critical"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-8">
      {/* Monthly Trends */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Monthly Trends
          </h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={refetchTrends}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        {trendsLoading ? (
          <LoadingSpinner size="lg" text="Loading trends data..." />
        ) : trendsError ? (
          <p>Something went wrong Try again</p>
        ) : (
          <Areachart monthlyTrends={monthlyTrends}/>
        )}
      </div>

      {/* Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Category Performance
            </h3>
            <button
              onClick={refetchCategory}
              className="text-blue-600 hover:text-blue-800 transition-colors">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          {categoryLoading ? (
            <LoadingSpinner text="Loading category data..." />
          ) : categoryError ? (
            <p>Something went wrong Try again</p>
          ) : (
            <div className="space-y-4">
              {complaintsByCategory?.slice(0, 6).map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {category.category_name}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">
                        {category.complaint_count} complaints
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {category.complaint_count}
                      </div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Department Ratings
            </h3>
            <button
              onClick={refetchRatings}
              className="text-blue-600 hover:text-blue-800 transition-colors">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          {ratingsLoading ? (
            <LoadingSpinner text="Loading ratings data..." />
          ) : ratingsError ? (
            <p>Something went wrong Try again</p>
          ) : (
            <div className="space-y-4">
              {departmentRatings?.map((dept, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {dept.department_name}
                    </h4>
                    <div className="text-sm text-gray-500">
                      {dept.total_feedback} reviews
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">
                      {dept.avg_rating || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-blue-100" />
            <span className="text-blue-100 text-sm">This Month</span>
          </div>
          <div className="text-3xl font-bold mb-2">
            {stats
              ? `${Math.round(
                  (stats.resolved_complaints / stats.total_complaints) * 100
                )}%`
              : "0%"}
          </div>
          <div className="text-blue-100">Resolution Rate</div>
          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-300" />
            <span className="text-green-300 text-sm">
              +2.1% from last month
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-8 w-8 text-green-100" />
            <span className="text-green-100 text-sm">This Month</span>
          </div>
          <div className="text-3xl font-bold mb-2">
            {stats?.resolved_complaints || 0}
          </div>
          <div className="text-green-100">Resolved Complaints</div>
          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-300" />
            <span className="text-green-300 text-sm">+18% from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Star className="h-8 w-8 text-purple-100" />
            <span className="text-purple-100 text-sm">This Month</span>
          </div>
          <div className="text-3xl font-bold mb-2">
            {stats?.average_rating || "0.0"}/5
          </div>
          <div className="text-purple-100">Citizen Satisfaction</div>
          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-300" />
            <span className="text-green-300 text-sm">+0.2 from last month</span>
          </div>
        </div>
      </div>

      {/* Department Performance Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Department Performance
        </h3>
        {ratingsLoading ? (
          <LoadingSpinner size="lg" text="Loading department performance..." />
        ) : ratingsError ? (
          <p>Something went wrong. Try again</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={departmentRatings.map((item) => ({
                ...item,
                avg_rating: Number(item.avg_rating) || 0.1,
              }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="department_name"
                tick={{ fontSize: 12, fill: "#6B7280" }}
                axisLine={true}
                tickLine={true}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6B280" }}
                axisLine={true}
                tickLine={true}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                }}
              />
              <Bar
                dataKey="avg_rating"
                fill="url(#colorGradient1)"
                radius={[4, 4, 0, 0]}
              />

              <defs>
                <linearGradient id="colorGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CC9E1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.9} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "analytics":
        return renderAnalyticsTab();
      case "performance":
        return renderPerformanceTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-1">
                Comprehensive insights into city service complaints
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">Last updated: 2 hours ago</span>
              </div>
              <button
                onClick={handleRefreshAll}
                className="bg-white shadow-lg rounded-xl p-3 hover:shadow-xl transition-all duration-300">
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}>
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="transition-all duration-300">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
