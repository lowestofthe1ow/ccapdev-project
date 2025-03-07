export function paginate(page, limit) {
    const actPage = !page || isNaN(parseInt(page)) ? 1 : Math.max(1, parseInt(page));
    const skip = (actPage - 1) * limit;
    return {
        $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: skip }, { $limit: limit }],
        },
    };
}

export function paginate_view(res, result, page, limit) {
    /* TODO: Pagination */

    const actPage = !page || isNaN(parseInt(page)) ? 1 : Math.max(1, parseInt(page));
    const totalThreads = result[0].metadata.length > 0 ? result[0].metadata[0].total : 0;
    const totalPages = Math.ceil(totalThreads / limit); /** Is this floor or ceiling */
    const threads = result[0].data;
    const breadcrumbNumbers = getPaginationNumbers(actPage, totalPages);
    /** MAYBE THERE'S A BETTER WAY, TOMORROW 03/03/2025 - RED WILL SHRINK THIS MFING CODE */
    res.locals.threads = threads;
    res.locals.breadcrumb_number = breadcrumbNumbers;
    res.locals.currentPage = actPage;
    res.locals.totalPages = totalPages;
    res.locals.nextPage = actPage + 1;
    res.locals.prevPage = actPage - 1;
    res.locals.showBreadCrumbs = totalThreads > limit;
}

export function getPaginationNumbers(page, totalPages) {
    page = parseInt(page, 10);
    totalPages = parseInt(totalPages, 10);
    const pagination = [];

    if (totalPages <= 7) {
        // If there are 7 or fewer pages, show all
        for (let i = 1; i <= totalPages; i++) {
            pagination.push({ number: i });
        }
    } else if (page <= 4) {
        // When on the first few pages: show first 5, "...", last
        for (let i = 1; i <= 5; i++) {
            pagination.push({ number: i });
        }
        pagination.push({ number: "...", isDots: true });
        pagination.push({ number: totalPages });
    } else if (page >= totalPages - 3) {
        // When on the last few pages: show first, "...", last 5
        pagination.push({ number: 1 });
        pagination.push({ number: "...", isDots: true });
        for (let i = totalPages - 4; i <= totalPages; i++) {
            pagination.push({ number: i });
        }
    } else {
        pagination.push({ number: 1 });

        let startPage = Math.max(2, page - 1);
        let endPage = Math.min(totalPages - 1, page + 1);

        if (startPage > 2) {
            pagination.push({ number: "...", isDots: true });
        }

        for (let i = startPage; i <= endPage; i++) {
            pagination.push({ number: i });
        }

        if (endPage < totalPages - 1) {
            pagination.push({ number: "...", isDots: true });
        }

        pagination.push({ number: totalPages });
    }

    return pagination;
}
