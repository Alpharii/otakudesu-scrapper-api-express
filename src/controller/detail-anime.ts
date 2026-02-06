import { load } from "cheerio"
import { fetchUtils } from "../utils/fetch-util"

type Episode = {
    title: string
    link: string
    slug: string
    release_date: string
}

type AnimeDetail = {
    title: string
    streaming_title: string
    thumbnail: string
    synopsis: string
    info: Record<string, string | string[]>
    episodes: Episode[]
    rekomendasi: RecommendedAnime[]
}

type RecommendedAnime = {
    title: string
    link: string
    slug: string
    thumbnail: string
}

export const detailAnime = async (slug: string) => {
    const html = await fetchUtils(`/anime/${slug}`)
    const $ = load(html)

    const title = $(".jdlrx h1").clone().children().remove().end().text().trim()
    const streaming_title = $(".subheading h2").text().trim()
    const thumbnail = $(".fotoanime img").first().attr("src") ?? ""

    const synopsis = $(".sinopc p")
        .map((_, el) => $(el).text().trim())
        .get()
        .join("\n")

    const info: Record<string, any> = {}

    $(".infozingle p").each((_, el) => {

        const label = $(el).find("b").text().replace(":", "").trim()

        const fullText = $(el).text()
        const value = fullText.replace(label, "")
            .replace(":", "")
            .trim()

        if (label === "Genre") {
            const genres = $(el).find("a")
                .map((_, g) => $(g).text().trim())
                .get()

            info.genres = genres
        }
        else {
            info[label.toLowerCase().replace(/\s/g, "_")] = value
        }
    })

    const episodes: any[] = []

    $(".episodelist").eq(1).find("ul li").each((_, el) => {

        const title = $(el).find("a").text().trim()
        const link = $(el).find("a").attr("href") ?? ""
        const slug = link.replace(/^https:\/\/otakudesu\.[a-zA-Z0-9-]+\/episode\//, '').replace('/', '')
        const release_date = $(el).find(".zeebr").text().trim()

        episodes.push({
            title,
            link,
            slug,
            release_date
        })
    })

    const rekomendasi: RecommendedAnime[] = []

    $(".isi-recommend-anime-series .isi-konten").each((_, el) => {

        const anchor = $(el).find(".isi-anime a").first()

        const title = $(el)
            .find(".judul-anime a")
            .text()
            .trim()

        const link = anchor.attr("href") ?? ""

        const slug = link
            .replace(/^https:\/\/otakudesu\.[a-zA-Z0-9-]+\/anime\//, "")
            .replace(/\/$/, "")

        const thumbnail = $(el)
            .find("img")
            .attr("src") ?? ""

        rekomendasi.push({
            title,
            link,
            slug,
            thumbnail
        })
    })

    const result: AnimeDetail = {
        title,
        streaming_title,
        thumbnail,
        synopsis,
        info,
        episodes,
        rekomendasi,
    }

    return {
        success: true,
        data: result
    }
}
