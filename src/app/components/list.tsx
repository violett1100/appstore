import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { AppData, MergedType, ItemsList, DetailType } from '../type/appData'
import { use, useState, useEffect } from 'react'
import InfiniteScroll from './infiniteScroll'

async function fetchDetail(id: string) {
    try {
        const res = await axios.get(`/api/proxy?id=${id}`)
        const data = res.data.results[0]
        return {
            id: data.trackId.toString(),
            count: data.userRatingCount,
            rate: data.averageUserRating,
        }
    } catch {
        return { id, count: '0', rate: '0' }
    }
}

function filterItems(items: AppData[], query: string) {
    const filteredItems = items.filter(
        (item) =>
            item['im:name']['label'].toLowerCase().includes(query.toLowerCase()) ||
            item['summary']['label'].toLowerCase().includes(query.toLowerCase()) ||
            item['title']['label'].toLowerCase().includes(query.toLowerCase())
    )
    return filteredItems
}

export function RecommendList(props: ItemsList) {
    const { query, data } = props
    const items: AppData[] = use(data)
    console.log(1)
    const filteredItems = filterItems(items, query)
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

export function FreeList(props: ItemsList) {
    const { query, data } = props
    const items: AppData[] = use(data)
    console.log(2)
    const filteredItems = filterItems(items, query)

    const ids = filteredItems.map((item) => item['id']['attributes']['im:id'])

    const newlist = filteredItems.map((item) => ({
        id: item['id']['attributes']['im:id'],
        title: item['im:name']['label'],
        image: item['im:image'][2]['label'],
        category: item['category']['attributes']['label'],
        link: item['id']['label'],
    }))

    const [app, setApp] = useState<DetailType[]>([])

    useEffect(() => {
        if (ids.length === 0) {
            setApp([])
            return
        }
        async function fetchPromise() {
            const results = await Promise.all(ids.map(fetchDetail))
            setApp(results)
        }
        fetchPromise()
    }, [query])

    const mergedArray: MergedType[] = newlist.map((a) => {
        const b = app?.find((b) => b.id === a.id)
        return b ? { ...a, ...b } : a
    })

    return (
        <>
            <div className="grid p-4">
                <InfiniteScroll items={mergedArray} query={query} />
            </div>
        </>
    )
}
