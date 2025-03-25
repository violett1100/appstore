'use client' // 使用 Redux 需要 client component

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/lib/store'
import { increment, decrement, reset } from '@/app/redux/counterSlice'

export default function CounterPage() {
    const count = useSelector((state: RootState) => state.counter.value)
    const dispatch = useDispatch()

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold">Counter: {count}</h1>
            <div className="flex space-x-4 mt-4">
                <button onClick={() => dispatch(increment())} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Increment
                </button>
                <button onClick={() => dispatch(decrement())} className="px-4 py-2 bg-red-500 text-white rounded">
                    Decrement
                </button>
                <button onClick={() => dispatch(reset())} className="px-4 py-2 bg-gray-500 text-white rounded">
                    Reset
                </button>
            </div>
        </div>
    )
}
