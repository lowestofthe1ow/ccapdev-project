/**
 * {@return a `$facet` aggregation stage for use in MongoDB}
 * @param {*} page - The current page
 * @param {*} limit - The max number of items in one page
 */
export function paginate(page, limit) {
    const current_page = !page || isNaN(parseInt(page)) ? 1 : Math.max(1, parseInt(page));
    const skip = (current_page - 1) * limit;

    return {
        $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: skip }, { $limit: limit }],
        },
    };
}

/**
 * Passes pagination data to the view.
 * @param {Array} query_results - The MongoDB query results
 * @param {string} page - The current page
 * @param {number} limit - The max number of items in one page
 * @param {string} name - The name of the field (e.g. `threads` or `comments`)
 */
export function paginate_view(res, query_results, page, limit, name) {
    const current_page = !page || isNaN(parseInt(page)) ? 1 : Math.max(1, parseInt(page));
    const total_items = query_results[0].metadata.length > 0 ? query_results[0].metadata[0].total : 0;
    const total_pages = Math.ceil(total_items / limit); /** Is this floor or ceiling */
    const data = query_results[0].data;
    const breadcrumb_numbers = get_pagination_numbers(current_page, total_pages);

    res.locals = { ...res.locals, breadcrumb_numbers, current_page, total_pages };
    res.locals[name] = data;
    res.locals.next_page = current_page + 1;
    res.locals.prev_page = current_page - 1;
    res.locals.show_breadcrumbs = total_items > limit;
}

/**
 * {@return an array of page numbers for use in the pagination breadcrumbs}
 * @param {*} page - The current page
 * @param {*} total_pages - The max number of pages
 */
function get_pagination_numbers(page, total_pages) {
    page = parseInt(page, 10);
    total_pages = parseInt(total_pages, 10);
    const pagination = [];

    if (total_pages <= 7) {
        // If there are 7 or fewer pages, show all
        for (let i = 1; i <= total_pages; i++) {
            pagination.push({ number: i });
        }
    } else if (page <= 4) {
        // When on the first few pages: show first 5, "...", last
        for (let i = 1; i <= 5; i++) {
            pagination.push({ number: i });
        }
        pagination.push({ number: "...", isDots: true });
        pagination.push({ number: total_pages });
    } else if (page >= total_pages - 3) {
        // When on the last few pages: show first, "...", last 5
        pagination.push({ number: 1 });
        pagination.push({ number: "...", isDots: true });
        for (let i = total_pages - 4; i <= total_pages; i++) {
            pagination.push({ number: i });
        }
    } else {
        pagination.push({ number: 1 });

        let startPage = Math.max(2, page - 1);
        let endPage = Math.min(total_pages - 1, page + 1);

        if (startPage > 2) {
            pagination.push({ number: "...", isDots: true });
        }

        for (let i = startPage; i <= endPage; i++) {
            pagination.push({ number: i });
        }

        if (endPage < total_pages - 1) {
            pagination.push({ number: "...", isDots: true });
        }

        pagination.push({ number: total_pages });
    }

    return pagination;
}
