export function getPaginationNumbers(page, totalPages) {
    page = parseInt(page, 10);
    totalPages = parseInt(totalPages, 10);
    const pagination = [];

    if (totalPages <= 7) {
        // If there are 7 or fewer pages, show all
        for (let i = 1; i <= totalPages; i++) {
            pagination.push({ number: i});
        }
    } else if (page <= 4) {
        // When on the first few pages: show first 5, "...", last
        for (let i = 1; i <= 5; i++) {
            pagination.push({ number: i});
        }
        pagination.push({ number: "...", isDots: true });
        pagination.push({ number: totalPages});
    } else if (page >= totalPages - 3) {
        // When on the last few pages: show first, "...", last 5
        pagination.push({ number: 1});
        pagination.push({ number: "...", isDots: true });
        for (let i = totalPages - 4; i <= totalPages; i++) {
            pagination.push({ number: i});
        }
    } else {
        pagination.push({ number: 1, });


        let startPage = Math.max(2, page - 1);
        let endPage = Math.min(totalPages - 1, page + 1);
        
        if (startPage > 2) {
            pagination.push({ number: "...", isDots: true });
        }

        for (let i = startPage; i <= endPage; i++) {
            pagination.push({ number: i, });
        }

        if (endPage < totalPages - 1) {
            pagination.push({ number: "...", isDots: true });
        }

        pagination.push({ number: totalPages,});

    }

    return pagination;
}