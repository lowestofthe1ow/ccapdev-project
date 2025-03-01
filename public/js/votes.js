window.addEventListener("load", () => {
    document.querySelectorAll(".forum__thread, .forum__comment").forEach(container => {
        const voteContainer = container.querySelector(".votes");
        if (!voteContainer) return;

        const isThread = container.classList.contains("forum__thread");
        const voteCounter = voteContainer.querySelector(isThread ? ".votes__counter" : ".comment__votes_counter");
        const buttons = voteContainer.querySelectorAll(".votes__button");
        const threadId = container.dataset.threadId || container.id;
        const commentId = isThread ? null : container.id;

        const updateCounterColor = () => {
            if (voteContainer.querySelector('[data-vote="up"]').classList.contains("button--current")) {
                voteCounter.style.color = "orange";
            } else if (voteContainer.querySelector('[data-vote="down"]').classList.contains("button--current")) {
                voteCounter.style.color = "blue";
            } else {
                voteCounter.style.color = "";
            }
        };

        buttons.forEach(button => {
            button.addEventListener("click", async (event) => {
                event.preventDefault();

                const voteType = button.dataset.vote;
                const isActive = button.classList.contains("button--current");

                buttons.forEach(btn => btn.classList.remove("button--current"));
                if (!isActive) button.classList.add("button--current");

                updateCounterColor();

                try {
                    const endpoint = isThread 
                        ? `/threads/${threadId}/vote/${voteType}` 
                        : `/threads/${threadId}/comments/${commentId}/vote/${voteType}`;

                    const response = await fetch(endpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    });

                    const result = await response.json();
                    if (!response.ok) {
                        alert(result.error || "Something went wrong.");
                        location.reload();
                    } else {
                        voteCounter.textContent = result.newVoteCount;
                        updateCounterColor();
                    }
                } catch (error) {
                    console.error("error:", error);
                    location.reload(); 
                }
            });
        });
    });
});
