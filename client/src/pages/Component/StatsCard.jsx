

const StatsCard = ({color,cardname,data,child}) => {
  return (
        <div className={`bg-gradient-to-r  rounded-2xl shadow-lg p-6 text-white from-${color}-500 to-${color}-600`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-${color}-100 text-sm font-medium`}>{cardname}</p>
                    <p className="text-3xl font-bold">{data}</p>
                </div>
                {child}
            </div>

        </div>
    )
}

export default StatsCard