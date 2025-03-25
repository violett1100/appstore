'use client'
import axios from 'axios'
import { use, useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RecommendAppSkeleton, FreeAppSkeleton } from '@/app/components/skeletons'
import { Suspense } from 'react'
import AppData from './type/appData'
import { StarSolid } from './ui/solidIcon'
import { StarOutline } from './ui/outlineIcon'

// import { SearchIcon } from 'lucide-react'

interface ItemsList {
    query: string
    data: Promise<AppData[]>
}

function RecommendList(props: ItemsList) {
    const { query, data } = props
    const items: AppData[] = use(data)
    console.log(1)

    const filteredItems = items.filter((item) => item['im:name']['label'].toLowerCase().includes(query.toLowerCase()))
    return (
        <div className="w-full inline-flex overflow-x-scroll gap-4 snap-x p-4">
            {filteredItems.map((item, i) => (
                <div key={i} className="w-22 shrink-0 snap-start scroll-ml-4">
                    <Link href={item['id']['label']}>
                        <Image
                            src={item['im:image'][2]['label']}
                            height={100}
                            width={100}
                            style={{ width: '100%' }}
                            className="rounded-2xl mb-2"
                            alt={item['title']['label']}
                        ></Image>
                        <p className="line-clamp-2 font-medium">{item['im:name']['label']}</p>
                        <p className="text-gray-500">{item['category']['attributes']['label']}</p>
                    </Link>
                </div>
            ))}
        </div>
    )
}

function FreeList(props: ItemsList) {
    const { query, data } = props
    const items: AppData[] = use(data)

    console.log(2)

    const filteredItems = items.filter((item) => item['im:name']['label'].toLowerCase().includes(query.toLowerCase()))

    const ids = filteredItems.map((item) => item['id']['attributes']['im:id']).slice(0, 10)

    const newlist: AType[] = filteredItems
        .map((item) => ({
            id: item['id']['attributes']['im:id'],
            title: item['im:name']['label'],
            image: item['im:image'][2]['label'],
            category: item['category']['attributes']['label'],
            // rate: fetchRate(item['id']['attributes']['im:id']),
            link: item['id']['label'],
        }))
        .slice(0, 10)
    const [app, setApp] = useState<BType[]>([])

    const fetchAppData = async (id: string): Promise<BType> => {
        try {
            const res = await axios.get(`/api/proxy?id=${id}`)
            const data = res.data.results[0]
            return {
                id: data.trackId.toString(),
                count: data.userRatingCount,
                rate: data.averageUserRating,
            }
        } catch {
            return { id, count: '0', rate: '0' } // 錯誤時回傳預設值，避免 undefined
        }
    }

    useEffect(() => {
        if (ids.length === 0) {
            setApp([]) // 如果沒有 id，直接清空
            return
        }

        const fetchAllData = async () => {
            const results = await Promise.all(ids.map(fetchAppData))
            setApp(results)
        }

        fetchAllData()
    }, [query])

    type AType = {
        id: string
        title: string
        image: string
        category: string
        link: string
    }

    type BType = {
        id: string
        count: string
        rate: string
    }

    type MergedType = AType & Partial<BType>

    const mergedArray: MergedType[] = newlist.map((a) => {
        const b = app?.find((b) => b.id === a.id)
        return b ? { ...a, ...b } : a
    })

    return (
        <>
            <div className="grid p-4">
                {mergedArray.map((item, i) => (
                    <Link key={i} href={item.link}>
                        <div className="flex items-center border-b border-gray-200 py-4 gap-3">
                            <p className="text-gray-400 text-xl">{i + 1}</p>
                            <Image
                                src={item.image}
                                height={80}
                                width={80}
                                className="rounded-full shrink-0"
                                alt={item.title}
                            ></Image>
                            <div>
                                <p className="line-clamp-2 font-medium">{item.title}</p>
                                <p className="text-gray-500">{item.category}</p>
                                <div className="text-gray-500 flex items-center gap-2">
                                    <div className="flex">
                                        {item.rate ? (
                                            <>
                                                {Array.from({ length: Math.round(Number(item.rate)) }).map((_, i) => (
                                                    <StarSolid className="size-4 text-orange-400" key={i} />
                                                ))}
                                                {Array.from({ length: 5 - Math.round(Number(item.rate)) }).map(
                                                    (_, i) => (
                                                        <StarOutline className="size-4 text-orange-400" key={i} />
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <StarOutline className="size-4 text-orange-400" key={i} />
                                                ))}
                                            </>
                                        )}
                                    </div>
                                    ({item.rate ? Number(item.count).toLocaleString() : 0})
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default function Home() {
    const [query, setQuery] = useState('')

    const dataFree = useMemo(() => {
        console.log('fetch free')
        return axios
            .get('https://itunes.apple.com/tw/rss/topfreeapplications/limit=100/json')
            .then((res) => res.data.feed.entry)
            .catch((err) => console.error(err))
    }, [])

    const dataRecommend = useMemo(() => {
        console.log('fetch recommend')
        return axios
            .get('https://itunes.apple.com/tw/rss/topgrossingapplications/limit=10/json')
            .then((res) => res.data.feed.entry)
            .catch((err) => console.error(err))
    }, [])

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
                {<RecommendList query={query} data={dataRecommend} />}
            </Suspense>
            {/* <FreeAppSkeleton /> */}
            <Suspense fallback={<FreeAppSkeleton />}>{<FreeList query={query} data={dataFree} />}</Suspense>
        </div>
    )
}
