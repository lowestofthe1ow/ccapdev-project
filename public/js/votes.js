document.querySelectorAll("[data-vote-counter]").forEach((button) => {
    button.addEventListener("click", async (event) => {
        event.preventDefault();

        const counterId = button.dataset.voteCounter; // The ID of the vote counter
        const voteType = button.dataset.voteType; // the vote type, up or down
        const threadId = button.dataset.threadId; // The ID of the thread

        if (!counterId || !voteType || !threadId) {
            return;
        }

        const voteCounter = document.getElementById(counterId);

        if (!voteCounter) return;

        const isThread = counterId === `#vote--${threadId}`; // If data-vote-counter matches data-thread-id, it's a me a thread

        // SR NOR LATCH AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        const oppositeVoteButton = document.querySelector(
            `[data-vote-counter="${counterId}"][data-vote-type="${voteType === "up" ? "down" : "up"}"]`
        );

        const isActive = button.classList.contains("button--current");
        const isOppositeActive = oppositeVoteButton.classList.contains("button--current");

        let currentCount = parseInt(voteCounter.textContent, 10) || 0;
        let voteChange = 0;

        voteChange = isActive
            ? voteType === "up"
                ? -1
                : 1
            : isOppositeActive
            ? voteType === "up"
                ? 2
                : -2
            : voteType === "up"
            ? 1
            : -1;

        voteCounter.textContent = currentCount + voteChange;

        voteCounter.style.color = isActive ? "" : voteType === "up" ? "orange" : "blue";

        button.classList.toggle("button--current", !isActive);
        if (isOppositeActive) oppositeVoteButton.classList.remove("button--current");

        try {
            const endpoint = isThread
                ? `/threads/${threadId}/vote/${voteType}`
                : `/threads/${threadId}/comments/${counterId.replace("#vote--", "")}/vote/${voteType}`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const result = await response.json();
            if (result.success) {
                voteCounter.textContent = result.newVoteCount;
                button.classList.remove("button--current");
                oppositeVoteButton.classList.remove("button--current");

                if (result.newVoteType === 1) {
                    button.classList.add("button--current");
                    voteCounter.style.color = "orange";
                } else if (result.newVoteType === -1) {
                    button.classList.add("button--current");
                    voteCounter.style.color = "blue";
                } else {
                    voteCounter.style.color = "";
                }
            } else {
                window.location.href = result.redirectUrl;
            }
        } catch (error) {
            console.error("Error:", error);
            window.location.href = "/signin";
        }
    });
});
