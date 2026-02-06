import { load } from "cheerio";
import { fetchUtils } from "../utils/fetch-util"

export const home = async () => {
    const html = await fetchUtils("/");
    const $ = load(html);

    const ongoing: any[] = [];
    const completed: any[] = [];

    $(".venz ul li .detpost").each((_, el) => {
        const epText = $(el).find(".epz").text().trim();
        const meta = $(el).find(".epztipe").text().trim();
        const date = $(el).find(".newnime").text().trim();

        const title = $(el).find(".jdlflm").text().trim();
        const thumbnail = $(el).find("img").attr("src") ?? "";
        const link = $(el).find(".thumb a").attr("href") ?? "";
        const slug = link.replace(/^https:\/\/otakudesu\.[a-zA-Z0-9-]+\/anime\//, '').replace('/', '')

        if (!title) return;

        const item = {
            title,
            slug,
            episodeInfo: epText,
            meta,
            date,
            link,
            thumbnail,
        };

        if (epText.toLowerCase().startsWith("episode")) {
            ongoing.push({ ...item, type: "ongoing" });
        } else if (epText.toLowerCase().endsWith("episode")) {
            completed.push({ ...item, type: "completed" });
        }
    });

    return {
        ongoing: {
            count: ongoing.length,
            data: ongoing,
        },
        completed: {
            count: completed.length,
            data: completed,
        },
    };
};
