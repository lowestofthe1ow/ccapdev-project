window.addEventListener("load", () => {
    document.querySelectorAll("[data-vote-counter]").forEach(button => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();
    
            const counterId = button.dataset.voteCounter; // The ID of the vote counter
            const voteType = button.dataset.voteType; // the vote type, up or down
            const threadId = button.dataset.threadId; // The ID of the thread
    
            if (!counterId || !voteType || !threadId){
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
            const isOppositeActive =  oppositeVoteButton.classList.contains("button--current");

            let voteChange = isOppositeActive ? (voteType === "up" ? 2 : -2) : (voteType === "up" ? 1 : -1);

            let currentCount = parseInt(voteCounter.textContent, 10) || 0;
            voteCounter.textContent = currentCount + voteChange;

            voteCounter.style.color = isActive ? "" : (voteType === "up" ? "orange" : "blue");

            button.classList.toggle("button--current", !isActive);
            if (isOppositeActive) oppositeVoteButton.classList.remove("button--current");

            try {
                const endpoint = isThread
                    ? `/threads/${threadId}/vote/${voteType}`
                    : `/threads/${threadId}/comments/${counterId.replace("#vote--", "")}/vote/${voteType}`;
    
                const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" } });
                const result = await response.json();
    
                if (!response.ok) {
                    alert(result.error || "Something went wrong.");
                    location.reload();
                } else {
                    voteCounter.textContent = result.newVoteCount;
                }
            } catch (error) {
                console.error("Error:", error);
                location.reload();
            }
        });
    }); 
});
