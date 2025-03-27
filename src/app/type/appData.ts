interface Image {
    label: string
    attributes: {
        height: string
    }
}

interface Summary {
    label: string
}

interface Price {
    label: string
    attributes: {
        amount: string
        currency: string
    }
}

interface ContentType {
    attributes: {
        term: string
        label: string
    }
}

interface Link {
    attributes: {
        rel: string
        type: string
        href: string
    }
}

interface Id {
    label: string
    attributes: {
        'im:id': string
        'im:bundleId': string
    }
}

interface Artist {
    label: string
    attributes: {
        href: string
    }
}

interface Category {
    attributes: {
        'im:id': string
        term: string
        scheme: string
        label: string
    }
}

interface ReleaseDate {
    label: string
    attributes: {
        label: string
    }
}

interface AppData {
    'im:name': {
        label: string
    }
    'im:image': Image[]
    summary: Summary
    'im:price': Price
    'im:contentType': ContentType
    rights: {
        label: string
    }
    title: {
        label: string
    }
    link: Link
    id: Id
    'im:artist': Artist
    category: Category
    'im:releaseDate': ReleaseDate
}

interface FreeType {
    id: string
    title: string
    image: string
    category: string
    link: string
}

interface DetailType {
    id: string
    count: string
    rate: string
}

interface ItemsList {
    query: string
    data: Promise<AppData[]>
}

type MergedType = FreeType & Partial<DetailType>

export type { AppData, ItemsList, MergedType, DetailType }
