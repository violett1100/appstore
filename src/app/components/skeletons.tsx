export function AppSkeleton() {
    const items = [1, 2, 3, 4]
    return (
        <div>
            <div className="w-full inline-flex overflow-hidden gap-4 p-4 animate-pulse">
                {items.map((item) => (
                    <div key={item} className="w-22 shrink-0">
                        <div className="w-[88px] h-[88px] bg-gray-200 rounded-2xl mb-[10px]"></div>
                        <div className="bg-gray-200 h-3 w-full rounded-2xl mb-2"></div>
                        <div className="bg-gray-200 h-3 w-full rounded-2xl"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
