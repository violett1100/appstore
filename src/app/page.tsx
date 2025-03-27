'use client'
import axios from 'axios'
import { useState, useMemo } from 'react'
import { RecommendAppSkeleton, FreeAppSkeleton } from '@/app/components/skeletons'
import { Suspense } from 'react'
import { RecommendList, FreeList } from './components/list'

function useFreeData() {
    const data = useMemo(() => {
        console.log('fetch free')
        return axios
            .get('https://itunes.apple.com/tw/rss/topfreeapplications/limit=100/json')
            .then((res) => res.data.feed.entry)
            .catch((err) => console.error(err))
    }, [])
    return data
}

function useRecommendData() {
    const data = useMemo(() => {
        console.log('fetch recommend')
        return axios
            .get('https://itunes.apple.com/tw/rss/topgrossingapplications/limit=10/json')
            .then((res) => res.data.feed.entry)
            .catch((err) => console.error(err))
    }, [])
    return data
}

export default function Home() {
    const [query, setQuery] = useState('')

    return (
        <div className="bg-white relative">
            <div className="bg-gray-50 py-3 px-4 fixed w-full">
                <input
                    className="bg-gray-200 w-full rounded-sm p-1 text-center"
                    type="text"
                    placeholder="搜尋"
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <div className="h-[56px]"></div>
            <Suspense fallback={<RecommendAppSkeleton />}>
                {<RecommendList query={query} data={useRecommendData()} />}
            </Suspense>
            {/* <FreeAppSkeleton /> */}
            <Suspense fallback={<FreeAppSkeleton />}>{<FreeList query={query} data={useFreeData()} />}</Suspense>
        </div>
    )
}
