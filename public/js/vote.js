window.addEventListener("load", () => {
    document.querySelectorAll(".forum__thread").forEach(threadContainer => {
        const voteContainer = threadContainer.querySelector(".votes")
        const threadId = threadContainer.id;
        const voteCounter = voteContainer.querySelector(".votes__counter") ;
        const buttons = voteContainer.querySelectorAll(".votes__button");

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
                    const response = await fetch(`/threads/${threadId}/vote/${voteType}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    });

                    const result = await response.json();
                    if (!response.ok) {
                        alert(result.error || "Something went wrong.");
                    } else {
                        voteCounter.textContent = result.newVoteCount;
                        updateCounterColor();
                    }
                } catch (error) {
                    console.error("Vote error:", error);
                }
            });
        });
    });
});
