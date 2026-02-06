import { load } from "cheerio"
import { fetchUtils } from "../utils/fetch-util"

type Mirror = {
    quality: string
    provider: string
    token: string
}

type DownloadProvider = {
    provider: string
    url: string
}

type Download = {
    quality: string
    size?: string
    providers: DownloadProvider[]
}

const extractSlug = (url?: string | null) => {
    if (!url) return null

    return url
        .replace(/^https:\/\/otakudesu\.[a-zA-Z0-9-]+\//, '')
        .replace(/^episode\//, '')
        .replace(/\/$/, '')
}

export const detailEpisode = async (slug: string) => {
    const html = await fetchUtils(`/episode/${slug}`)
    const $ = load(html)
    const title = $(".posttl").text().trim()

    const metadata = {
        author: $(".kategoz span").first().text().replace("Posted by", "").trim(),
        release: $(".kategoz span").eq(1).text().replace("Release on", "").trim()
    }

    //info
    const info: Record<string, any> = {}

    const thumbnail = $(".cukder").find("img").attr("src") ?? null
    info.thumbnail = thumbnail

    $(".infozingle p").each((_, el) => {

        const label = $(el).find("b").text().replace(":", "").trim()

        const fullText = $(el).text()
        const value = fullText.replace(label, "")
            .replace(":", "")
            .trim()

        if (label === "Genres") {
            const genres = $(el).find("a")
            .map((_, g) => $(g).text().trim())
            .get()
            
            info.genres = genres
        }
        else {
            info[label.toLowerCase().replace(/\s/g, "_")] = value
        }
    })


    const iframe = $("#pembed iframe").attr("src") ?? null

    const previousUrl = $(".flir a").eq(0).attr("href")
    const animeUrl = $(".flir a").eq(1).attr("href")
    const nextUrl = $(".flir a").eq(2).attr("href")

    const navigation = {
        previous: previousUrl ? {
            url: previousUrl,
            slug: extractSlug(previousUrl)
        } : null,

        anime: animeUrl ? {
            url: animeUrl,
            slug: animeUrl.split("/anime/")[1]?.replace("/", "")
        } : null,

        next: nextUrl ? {
            url: nextUrl,
            slug: extractSlug(nextUrl)
        } : null
    }

    const episodes:any[] = []

    $(".keyingpost li a").each((_, el) => {
        const link = $(el).attr("href")
        episodes.push({
            title: $(el).text().trim(),
            url: link,
            slug: extractSlug(link)
        })
    })

    const mirrors: Mirror[] = []

    $(".mirrorstream ul").each((_, ul) => {

        const quality =
            $(ul).find("span").parent().text()
                .replace(/Mirror/i, "")
                .trim()

        $(ul).find("li a").each((_, a) => {

            mirrors.push({
                quality,
                provider: $(a).text().trim(),
                token: $(a).attr("data-content") ?? ""
            })
        })
    })

    const downloads: Download[] = []

    $(".download ul li").each((_, li) => {

        const providers: DownloadProvider[] = []

        $(li).find("a").each((_, a) => {

            providers.push({
                provider: $(a).text().trim(),
                url: $(a).attr("href") ?? ""
            })
        })

        downloads.push({
            quality: $(li).find("strong").text().trim(),
            size: $(li).find("i").text().trim(),
            providers
        })
    })

    return {
        success: true,
        data: {
            title,
            metadata,
            info,
            iframe,
            navigation,
            episodes,
            mirrors,
            downloads
        }
    }
}
