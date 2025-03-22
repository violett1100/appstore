'use client'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Card, Space, ConfigProvider } from 'antd'
import Image from 'next/image'

export default function Home() {
    const [data, setData] = useState([])

    useEffect(() => {
        axios
            .get('https://itunes.apple.com/tw/rss/topfreeapplications/limit=100/json')
            .then((response) => setData(response.data.feed.entry))
            .catch((error) => console.error('Error:', error))
    }, [])
    console.log(data)
    return (
        <div className="p-4">
            <ConfigProvider
                theme={{
                    components: {
                        Card: {
                            /* here is your component tokens */
                            bodyPadding: 0,
                        },
                    },
                }}
            >
                <Space direction="horizontal" size={16}>
                    {data
                        ? data.map((item, i) => (
                              <Card key={i} hoverable variant="borderless" style={{ width: 88 }}>
                                  <Image
                                      src={item['im:image'][2]['label']}
                                      height={100}
                                      width={100}
                                      style={{ width: '100%' }}
                                      className="rounded-2xl mb-2"
                                      alt={item['title']['label']}
                                  ></Image>
                                  <p className="line-clamp-2">
                                      {i + 1}: {item['title']['label']}
                                  </p>
                              </Card>
                          ))
                        : 'Loading...'}
                </Space>
            </ConfigProvider>
        </div>
    )
}
