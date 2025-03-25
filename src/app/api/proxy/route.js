import axios from 'axios'

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    try {
        const response = await axios.get('https://itunes.apple.com/tw/lookup?id=' + id)
        return Response.json(response.data)
    } catch (error) {
        return Response.json({ error: 'Failed to fetch data' }, { status: 500 }, { msg: error })
    }
}
