import { load } from "cheerio"
import { fetchUtils } from "../utils/fetch-util"

export const search = async (query: string) => {
    const html = await fetchUtils(`/?s=${query}&post_type=anime`)
    const $ = load(html)

    const results: any[] = []

    $(".chivsrc li").each((_, el) => {
        const image = $(el).find("img").attr("src") || ""
        const title = $(el).find("h2 a").text().trim()
        const link = $(el).find("h2 a").attr("href") || ""
        const slug = link.replace(/^https:\/\/otakudesu\.[a-zA-Z0-9-]+\/anime\//, '').replace('/', '')

        const genres: string[] = []
        $(el)
            .find(".set")
            .first()
            .find("a")
            .each((_, g) => {
                genres.push($(g).text().trim())
            })

        const status = $(el)
            .find(".set")
            .eq(1)
            .text()
            .replace("Status", "")
            .replace(":", "")
            .trim()

        const rating = $(el)
            .find(".set")
            .eq(2)
            .text()
            .replace("Rating", "")
            .replace(":", "")
            .trim()

        results.push({
            title,
            link,
            slug,
            image,
            genres,
            status,
            rating
        })
    })

    return {
        success: true,
        total_data: results.length,
        data: results
    }
}
