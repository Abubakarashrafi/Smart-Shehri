import { useState } from "react";
import {
  Users,
  Building,
  MapPin,
  FileText,
  BarChart3,
  Plus,
} from "lucide-react";

import {
  departmentsAPI,
  workersAPI,
  citiesAPI,
  complaintsAPI,
} from "../services/api";
import { useApi } from "../hooks/useApi";
import LoadingSpinner from "./Component/LoadingSpinner";
import { EfficiencyBar } from "./Component/EfficencyBar";
import StatsCard from "./Component/StatsCard";
import SectionHeader from "./Component/SectionHeader";
import InfoCard from "./Component/InfoCard";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState("");
  const [formData, setFormData] = useState({});
  const [modalType, setModalType] = useState("");

  const {
    data: departments,
    loading: deptLoading,
    error: deptError,
  } = useApi(departmentsAPI.getAll);
  const {
    data: workers,
    loading: workersLoading,
    error: workersError,
  } = useApi(workersAPI.getAll);
  const {
    data: cities,
    loading: citiesLoading,
    error: citiesError,
  } = useApi(citiesAPI.getAll);
  const { data: complaint } = useApi(complaintsAPI.getAll);
  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "departments", name: "Departments", icon: Building },
    { id: "workers", name: "Workers", icon: Users },
    { id: "cities", name: "Cities", icon: MapPin },
  ];

  const handleAdd = (type) => {
    setModalType(type);
    setShowModal(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (modalType === "department") {
      const { name, phone_number, email, city_id } = formData;

      if (!name || name.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters long";
      } else if (!/^[A-Za-z\s]+$/.test(name)) {
        newErrors.name = "Name must contain alphabets only";
      }

      if (!phone_number) {
        newErrors.phone_number = "Phone number is required";
      } else if (!/^\d+$/.test(phone_number)) {
        newErrors.phone_number = "Phone must contain digits only";
      } else if (phone_number.length < 10) {
        newErrors.phone_number = "Invalid phone number";
      }

      if (!email || !emailRegex.test(email)) {
        newErrors.email = "Invalid email format";
      }
      if (!city_id) {
        newErrors.city_id = "select city";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        try {
          await departmentsAPI.create(formData);
          setShowModal(false);
        } catch (err) {
          console.error("Failed to create department:", err);
        } finally {
          setErrors(null);
        }
      }
    } else if (modalType === "worker") {
      try {
        const {
          worker_name,
          worker_email,
          worker_phone_number,
          department_id,
        } = formData;
        if (!worker_name || worker_name.trim().length < 3) {
          newErrors.worker_name = "Name must be at least 3 characters long";
        } else if (!/^[A-Za-z\s]+$/.test(worker_name)) {
          newErrors.worker_name = "Name must contain alphabets only";
        }

        if (!worker_phone_number) {
          newErrors.worker_phone_number = "Phone number is required";
        } else if (!/^\d+$/.test(worker_phone_number)) {
          newErrors.worker_phone_number = "Phone must contain digits only";
        } else if (worker_phone_number.length < 10) {
          newErrors.worker_phone_number = "Invalid phone number";
        }

        if (!worker_email || !emailRegex.test(worker_email)) {
          newErrors.worker_email = "Invalid email format";
        }
        if (!department_id) {
          newErrors.department_id = "select department";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
          try {
            console.log(formData);

            await workersAPI.create({
              name: worker_name,
              email: worker_email,
              phone: worker_phone_number,
              department_id,
            });
            setShowModal(false);
          } catch (err) {
            console.error("Failed to create department:", err);
          }
        }
      } catch (err) {
        console.error("Failed to create worker:", err);
      }
    } else if (modalType === "city") {
      const { name, province } = formData;
      if (!name) newErrors.name = "City name is required";
      if (!province) newErrors.province = "Province is required";

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        try {
          await citiesAPI.create(formData);
          setShowModal(false);
        } catch (err) {
          console.error("Failed to create city:", err);
        }
      }
    }
  };

  const Statscard = [
    {
      id: 1,
      cardname: "Total Departments",
      data: departments?.length || 0,

      color: "blue",

      child: <Building className={`h-8 w-8 text-blue-200`} />,
    },
    {
      id: 2,
      cardname: "Active Workers",
      data: workers?.length || 0,
      color: "green",
      child: <Users className="h-8 w-8 text-green-200" />,
    },
    {
      id: 3,
      cardname: "Cities Covered",
      data: cities?.length || 0,
      color: "purple",
      child: <MapPin className="h-8 w-8 text-purple-200" />,
    },
    {
      id: 4,
      cardname: "Total Complaints",
      data: complaint?.pagination?.totalCount || 0,
      color: "orange",
      child: <FileText className="h-8 w-8 text-orange-200" />,
    },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Statscard.map((item) => (
          <StatsCard
            key={item.id}
            data={item.data}
            color={item.color}
            cardname={item.cardname}
            child={item.child}
          />
        ))}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Department Performance
          </h3>
          {deptLoading ? (
            <LoadingSpinner text="Loading departments..." />
          ) : deptError ? (
            <p>Something went wrong try again</p>
          ) : (
            <div className="space-y-4">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">{dept.name}</h4>
                    <p className="text-sm text-gray-500">
                      {dept.worker_count} workers • {dept.complaint_count}{" "}
                      complaints
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {dept?.efficiency_percent || 0}%
                      </p>
                      <p className="text-xs text-gray-500">Efficiency</p>
                    </div>
                    <EfficiencyBar
                      percentage={Number(dept.efficiency_percent) || 0}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Current Active Workers
          </h3>
          {workersLoading ? (
            <LoadingSpinner text="Loading workers..." />
          ) : workersError ? (
            <p>Something went wrong try again</p>
          ) : (
            <div className="space-y-4">
              {workers?.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">{worker.name}</h4>
                    <p className="text-sm text-gray-500">
                      {worker.designation} • {worker.active_assignments} active
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDepartments = () => (
    <div className="space-y-6">
      <SectionHeader
        title={"Departments Management"}
        subtitle={"Manage city departments and their operations "}
        buttonText={"Add Department"}
        fromcolor={"blue"}
        tocolor={"purple"}
        onClick={() => handleAdd("department")}
      />

      {deptLoading ? (
        <LoadingSpinner size="lg" text="Loading departments..." />
      ) : deptError ? (
        <p>Something went wrong try again</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments?.map((dept) => (
            <InfoCard
              key={dept.id}
              title={dept.name}
              subtitle={dept.city_name}
              icon={Building}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              fields={[
                { label: "Workers", value: dept.worker_count },
                { label: "Complaints", value: dept.complaint_count },
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderWorkers = () => (
    <div className="space-y-6">
      <SectionHeader
        title={"Workers Management"}
        subtitle={"Manage department workers and assignments"}
        buttonText={"Add Workers"}
        onClick={() => handleAdd("worker")}
        fromcolor={"green"}
        tocolor={"emerald"}
      />

      {workersLoading ? (
        <LoadingSpinner size="lg" text="Loading workers..." />
      ) : workersError ? (
        <p>Something went wrong try again</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers?.map((worker) => (
            <InfoCard
              key={worker.id}
              title={worker.name}
              subtitle={worker.department_name}
              icon={Users}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              fields={[
                {
                  label: "Active Assignments",
                  value: worker.active_assignments,
                },
                { label: "Employee ID", value: worker.id },
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderCities = () => (
    <div className="space-y-6">
      <SectionHeader
        title={"Cities Management"}
        subtitle={"Manage cities and their statistics"}
        onClick={() => handleAdd("city")}
        buttonText={"Add city"}
        fromcolor={"purple"}
        tocolor={"pink"}
      />

      {citiesLoading ? (
        <LoadingSpinner size="lg" text="Loading cities..." />
      ) : citiesError ? (
        <p>Something went wrong try again</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities?.map((city) => (
            <InfoCard
              key={city.id}
              title={city.name}
              subtitle={city.province}
              icon={MapPin}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              fields={[]}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "departments":
        return renderDepartments();
      case "workers":
        return renderWorkers();
      case "cities":
        return renderCities();

      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Panel
          </h1>
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
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {modalType === "department" && (
                  <>
                    <input
                      name="name"
                      placeholder="Department Name"
                      className="w-full border px-3 py-2 rounded mb-3"
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                    <input
                      name="email"
                      placeholder="Department Email"
                      className="w-full border px-3 py-2 rounded mb-3"
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                    <input
                      name="phone_number"
                      placeholder="Phone Number"
                      className="w-full border px-3 py-2 rounded mb-3"
                      onChange={handleChange}
                    />
                    {errors.phone_number && (
                      <p className="text-sm text-red-500">
                        {errors.phone_number}
                      </p>
                    )}
                    <select
                      name="city_id"
                      className="w-full border px-3 py-2 rounded mb-3"
                      onChange={handleChange}>
                      <option value="">Select City</option>
                      {cities?.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.city_id && (
                      <p className="text-sm text-red-500">{errors.city_id}</p>
                    )}
                  </>
                )}

                {modalType === "worker" && (
                  <>
                    <input
                      name="worker_name"
                      placeholder="Worker Name"
                      className="w-full border px-3 py-2 rounded mb-3"
                      onChange={handleChange}
                    />
                    {errors.worker_name && (
                      <p className="text-sm text-red-500">
                        {errors.worker_name}
                      </p>
                    )}

                    <input
                      name="worker_email"
                      placeholder="Email"
                      className="w-full border px-3 py-2 rounded mb-3"
                      onChange={handleChange}
                    />
                    {errors.worker_email && (
                      <p className="text-sm text-red-500">
                        {errors.worker_email}
                      </p>
                    )}

                    <input
                      name="worker_phone_number"
                      placeholder="phone number"
                      className="w-full border px-3 py-2 rounded mb-3"
                      onChange={handleChange}
                    />
                    {errors.worker_phone_number && (
                      <p className="text-sm text-red-500">
                        {errors.worker_phone_number}
                      </p>
                    )}

                    <select
                      name="department_id"
                      className="w-full border px-3 py-2 rounded mb-3"
                      onChange={handleChange}>
                      <option value="">Select Department</option>
                      {departments?.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {errors.department_id && (
                      <p className="text-sm text-red-500">
                        {errors.department_id}
                      </p>
                    )}
                  </>
                )}

                {modalType === "city" && (
                  <>
                    <input
                      name="name"
                      placeholder="City Name"
                      className="w-full border px-3 py-2 rounded mb-3"
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                    <input
                      name="province"
                      placeholder="Province"
                      className="w-full border px-3 py-2 rounded mb-3"
                      onChange={handleChange}
                    />
                    {errors.province && (
                      <p className="text-sm text-red-500">{errors.province}</p>
                    )}
                  </>
                )}

                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="transition-all duration-300">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
