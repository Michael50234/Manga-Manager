import { ReleasingSeries } from "~/types";

// Creates an email message string from the list of releasing series
export const createNotificationMessage = (
    username: string,
    releasingSeries: ReleasingSeries[]
) => {
    const formattedSeries = releasingSeries.map((series) => {
        if(series.mangaAccessLink) {
            return `• ${series.title}\n${series.mangaAccessLink}`;
        }

        return `• ${series.title}`;
    }).join("\n\n");

    return `
        Hello ${username},

        The following manga from your reading list release today:

        ${formattedSeries}

        Enjoy reading!
    `;
};

export const createNotificationEmailHtml = (
    username: string,
    releasingSeries: ReleasingSeries[]
) => {
    const mangaListItems = releasingSeries
        .map((series) => {
            if(series.mangaAccessLink) {
                return `
                    <li>
                        <a href="${series.mangaAccessLink}">
                            ${series.title}
                        </a>
                    </li>
                `;
            }

            return `<li>${series.title}</li>`;
        })
        .join("");

    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Hello ${username},</h2>

            <p>
                The following manga from your reading list are releasing today:
            </p>

            <ul>
                ${mangaListItems}
            </ul>

            <p>
                Thank you for using Personal Manga Manager.
            </p>
        </div>
    `;
};