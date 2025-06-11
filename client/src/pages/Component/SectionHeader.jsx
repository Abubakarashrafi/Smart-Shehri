import { Plus } from "lucide-react"

function SectionHeader({title,subtitle,buttonText,onClick,fromcolor,tocolor}) {
  return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
              <h2 className="text-2xl font-bold text-gray-900">
                 {title}
              </h2>
              <p className="text-gray-600">
                 {subtitle}
              </p>
          </div>
          <div className="flex items-center space-x-4">
              <button
                  onClick={onClick}
                  className={`bg-gradient-to-r from-${fromcolor}-600 to-${tocolor}-600 text-white px-4 py-2 rounded-xl hover:from-${fromcolor}-700 hover:to-${tocolor}-700 transition-all duration-300 flex items-center space-x-2 shadow-lg`}>
                  <Plus className="h-4 w-4" />
                  <span>{buttonText}</span>
              </button>
          </div>
      </div>
  )
}

export default SectionHeader