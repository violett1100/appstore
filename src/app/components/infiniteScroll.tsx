'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LoaderCircle } from 'lucide-react'
import { MergedType } from '../type/appData'
import { StarSolid } from '../ui/solidIcon'
import { StarOutline } from '../ui/outlineIcon'

export default function InfiniteScroll(props: { items: MergedType[]; query: string }) {
    const { items, query } = props
    const [count, setCount] = useState(10)
    const visibleItems = items.slice(0, count)

    const observerRef = useRef<HTMLDivElement | null>(null)
    console.log(count)
    console.log(items.length)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && count < items.length) {
                    setTimeout(() => {
                        setCount((prev) => prev + 10)
                    }, 1000)
                }
            },
            { threshold: 1.0 }
        )

        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        return () => observer.disconnect()
    }, [count, items.length])

    // 搜尋時重置頁數並回到最上方
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => {
            setCount(10)
        }, 500)
    }, [query])

    return (
        <>
            {visibleItems.map((item, i) => (
                <Link key={i} href="">
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
                                            {Array.from({ length: 5 - Math.round(Number(item.rate)) }).map((_, i) => (
                                                <StarOutline className="size-4 text-orange-400" key={i} />
                                            ))}
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

            {count < items.length ? (
                <div ref={observerRef} className="justify-center flex gap-2 py-6">
                    <LoaderCircle className="animate-spin" />
                    載入更多
                </div>
            ) : (
                ''
            )}
        </>
    )
}
