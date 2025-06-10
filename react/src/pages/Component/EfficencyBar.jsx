export const EfficiencyBar = ({ percentage }) => {

   

    return (
        <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-500 bg-green-400 w-[${(percentage)}%]`}
                    
                ></div>
            </div>
            <span className="text-xs font-medium text-gray-600">{percentage}%</span>
        </div>
    );
};


