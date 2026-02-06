import { load } from "cheerio"
import { fetchUtils } from "../utils/fetch-util"

export const complete = async (page: string) => {
    const html = await fetchUtils(`/complete-anime/page/${page}`)
    const $ = load(html)
    const results: any[] = []

    $(".venz ul li .detpost").each((_, el) => {
        const title = $(el).find(".jdlflm").text().trim()
        const episode = $(el).find(".epz").text().trim()
        const day = $(el).find(".epztipe").text().trim()
        const date = $(el).find(".newnime").text().trim()

        const thumbnail = $(el).find("img").attr("src") ?? ""
        const link = $(el).find(".thumb a").attr("href") ?? ""
        const slug = link.replace(/^https:\/\/otakudesu\.[a-zA-Z0-9-]+\/anime\//, '').replace('/', '')

        if (!title) return

        results.push({
            title,
            slug,
            episode,
            day,
            date,
            link,
            thumbnail
        })
    })

    const pages: number[] = []
    $(".pagination .page-numbers").each((_, el) => {

        const num = Number($(el).text())

        if (!isNaN(num)) {
            pages.push(num)
        }
    })

    const currentPage =
        Number($(".page-numbers.current").text()) || 1

    const nextPage =
        $(".next.page-numbers").attr("href") ?? null


    return {
        success: true,
        page: currentPage,
        total_data: results.length,

        pagination: {
            available_pages: pages,
            next_page: nextPage
        },

        data: results
    }
}
