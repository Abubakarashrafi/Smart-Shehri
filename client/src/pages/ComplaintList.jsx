import { useState, useEffect } from "react";
import {
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MapPin,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { complaintsAPI, citiesAPI, resolutionApi } from "../services/api";
import { useApi, usePaginatedApi } from "../hooks/useApi";
import LoadingSpinner from "./Component/LoadingSpinner";

const ComplaintsList = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [cityFilter, setCityFilter] = useState();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    data: complaintsData,
    loading,
    error,
    params,
    updateParams,
    refetch,
  } = usePaginatedApi(complaintsAPI.getAll, {
    page: 1,
    limit: 10,
    status: "",
    priority: "",
    city_id: "",
  });
  const { data: citiesData } = useApi(citiesAPI.getAll);

  useEffect(() => {
    const newParams = {
      ...params,
      page: 1,
      status: statusFilter,
      priority: priorityFilter,
      city_id: cityFilter,
    };
    updateParams(newParams);
  }, [statusFilter, priorityFilter, cityFilter]);

  const complaints = complaintsData?.complaints || [];
  const pagination = complaintsData?.pagination || {};

  const handleMarkResolved = async (category_id, complaint_id) => {
    try {
      useApi(resolutionApi.create({ complaint_id, category_id }));
      setShowModal(false);
    } catch (error) {
      console.error("Failed to mark complaint as resolved:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "assigned":
        return <User className="h-4 w-4" />;
      case "in_progress":
        return <AlertTriangle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return "text-gray-600 bg-gray-100";
      case 2:
        return "text-blue-600 bg-blue-100";
      case 3:
        return "text-yellow-600 bg-yellow-100";
      case 4:
        return "text-orange-600 bg-orange-100";
      case 5:
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      case 4:
        return "Critical";
      case 5:
        return "Critical";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewComplaint = async (complaint) => {
    try {
      setSelectedComplaint(complaint);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching complaint details:", error);
    }
  };

  const handlePageChange = (page) => {
    updateParams({ ...params, page });
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {complaints.map((complaint) => (
        <div
          key={complaint.id}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span
              className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                complaint.status
              )}`}>
              {getStatusIcon(complaint.status)}
              <span className="capitalize">
                {complaint.status.replace("_", " ")}
              </span>
            </span>

            <span
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                complaint.priority
              )}`}>
              <span>{getPriorityLabel(complaint.priority)}</span>
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {complaint.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {complaint.description}
          </p>

          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{complaint.citizen_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{complaint.city_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(complaint.created_at)}</span>
            </div>
          </div>

          <button
            onClick={() => handleViewComplaint(complaint)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </button>
        </div>
      ))}
    </div>
  );

  if (loading && !complaints.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading complaints..." />
      </div>
    );
  }

  if (error && !complaints.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <p>Something went wrong Try again</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                All Complaints
              </h1>
              <p className="text-lg text-gray-600 mb-1">
                View and track all submitted complaints
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refetch}
                className="bg-white shadow-lg rounded-xl p-3 hover:shadow-xl transition-all duration-300">
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option value="">All Priorities</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">Critical</option>
                <option value="5">Critical</option>
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option value="">All Cities</option>
                {loading &&
                  citiesData.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Showing {complaints.length} of {pagination.totalCount || 0}{" "}
              complaints
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <LoadingSpinner text="Loading complaints..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8">
            <p>Something went wrong try again</p>
          </div>
        )}

        {!loading && !error && <div className="mb-8">{renderGridView()}</div>}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-sm text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>

              {[...Array(pagination.totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= pagination.currentPage - 1 &&
                    page <= pagination.currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        pagination.currentPage === page
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}>
                      {page}
                    </button>
                  );
                } else if (
                  page === pagination.currentPage - 2 ||
                  page === pagination.currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-2">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {showModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Complaint Details
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors">
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Title</h3>
                    <p className="text-gray-700">{selectedComplaint.title}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Status
                      </h3>
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          selectedComplaint.status
                        )}`}>
                        {getStatusIcon(selectedComplaint.status)}
                        <span className="capitalize">
                          {selectedComplaint.status.replace("_", " ")}
                        </span>
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Priority
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          selectedComplaint.priority
                        )}`}>
                        {getPriorityLabel(selectedComplaint.priority)}
                      </span>
                    </div>
                    {selectedComplaint.status !== "resolved" && (
                      <button
                        onClick={() =>
                          handleMarkResolved(
                            selectedComplaint.category_id,
                            selectedComplaint.id
                          )
                        }
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 mr-4">
                        Mark as Resolved
                      </button>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Citizen Information
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700">
                        <strong>Name:</strong> {selectedComplaint.citizen_name}
                        <br />
                        <strong>Email:</strong>{" "}
                        {selectedComplaint.citizen_email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Location
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700">
                        {selectedComplaint.city_name},{" "}
                        {selectedComplaint.location_name}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Department
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700">
                        {selectedComplaint.department_name}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Submitted
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700">
                        {formatDate(selectedComplaint.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsList;
