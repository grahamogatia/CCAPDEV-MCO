document.addEventListener("DOMContentLoaded", function() {
  var commentForm = document.getElementById("comment-form");
  var commentInput = document.getElementById("comment-input");
  var commentsList = document.getElementById("comments-list");

  addComment("Thank you for rating our restaurant! We appreciate your feedback and value your opinion. We're sorry to hear that your experience with our customer service was not exceptional. We take your feedback seriously and will use it to improve our services. We hope to have another opportunity to serve you better in the future. If there's anything specific you'd like to share with us to help us improve, please feel free to let us know.", 10, 5);

  addComment("We apologize for any inconvenience or disappointment you may have encountered during your visit. Your feedback is valuable to us, and we'll take it into consideration as we work on improving our customer service. We hope to have the chance to provide you with a better experience in the future. If there's anything specific you'd like to share with us to help us address your concerns, please feel free to let us know.", 25, 50);

  addComment("Thank you for taking the time to rate our restaurant! We truly appreciate your feedback and are thrilled to hear that you had a fantastic experience with our customer service. Your 5-star rating means a lot to us, and we'll continue striving to provide exceptional service to all our valued customers. We look forward to serving you again in the future.", 100, 37);

  addComment("We appreciate your feedback and are glad to hear that you had a positive experience with our customer service. We constantly strive to provide excellent service to all our customers, and your rating is a great encouragement for us.", 75, 5);

  addComment("We're sorry to hear that you had a disappointing experience at our restaurant, and we appreciate your feedback, even if it's a 1-star rating. We apologize for failing to meet your expectations with our customer service.", 50, 123);

  commentForm.addEventListener("submit", function(event) {
    event.preventDefault();
  
    var commentText = commentInput.value;
    if (commentText.trim() !== "") {
      var commentElement = createCommentElement(commentText);
      commentsList.appendChild(commentElement);

      commentInput.value = "";
    }
  });

  function createCommentElement(commentText) {
    var commentElement = document.createElement("div");
    commentElement.className = "comment";

    var profilePicture = document.createElement("img");
    profilePicture.src = "icons/admin.png";
    profilePicture.className = "profile-picture";
    commentElement.appendChild(profilePicture);

    var ownerNameElement = document.createElement("p");
    ownerNameElement.textContent = "Owner's Name";
    ownerNameElement.className = "owner-name";
    ownerNameElement.style.fontWeight = "bold";

    var verifiedText = document.createElement("p");
    verifiedText.className = "verifiedText";
    verifiedText.textContent = "©";
    
    var ownerContainer = document.createElement("div");
    ownerContainer.className = "owner-container";
    
    ownerContainer.appendChild(ownerNameElement);
    ownerContainer.appendChild(verifiedText);
    
    commentElement.appendChild(ownerContainer);

    var commentTextElement = document.createElement("p");
    commentTextElement.textContent = commentText;
    commentElement.appendChild(commentTextElement);

    var commentActions = document.createElement("div");
    commentActions.className = "comment-actions";

    var editButton = createButton("Edit", "edit-button");
    var editMode = false; // Track the edit mode
    var editCommentText; // Store the original comment text
    editButton.addEventListener("click", function () {
      if (editMode) {
        saveEditedComment(commentTextElement, editCommentText);
        editButton.textContent = "Edit";
        editMode = false;
      } else {
        editCommentText = commentTextElement.textContent;
        commentTextElement.contentEditable = true;
        commentTextElement.classList.add("editable");
        editButton.textContent = "Save";
        editMode = true;
      }
    });

    var deleteButton = createButton("Delete", "delete-button");
    deleteButton.addEventListener("click", function () {
      deleteComment(commentElement);
    });

    commentActions.appendChild(editButton);
    commentActions.appendChild(deleteButton);
    commentElement.appendChild(commentActions);

    var thumbsUpButton = createButton("▲", "upvote");
    var thumbsUpCount = createVoteCount();
    thumbsUpButton.appendChild(thumbsUpCount);
    thumbsUpButton.addEventListener("click", function () {
      updateVoteCount(thumbsUpCount, 1);
    });

    var thumbsDownButton = createButton("▼", "downvote");
    var thumbsDownCount = createVoteCount();
    thumbsDownButton.appendChild(thumbsDownCount);
    thumbsDownButton.addEventListener("click", function () {
      updateVoteCount(thumbsDownCount, 1);
    });

    commentActions.appendChild(thumbsUpButton);
    commentActions.appendChild(thumbsDownButton);
    commentElement.appendChild(commentActions);
    
    return commentElement;
  }

  function createButton(text, className) {
    var button = document.createElement("button");
    button.innerHTML = text;
    button.className = className;
    return button;
  }

  function createVoteCount() {
    var voteCount = document.createElement("span");
    voteCount.className = "vote-count";
    voteCount.textContent = "0";
    return voteCount;
  }

  function updateVoteCount(voteCount, increment) {
    var count = parseInt(voteCount.textContent);
    voteCount.textContent = count + increment;
  }

  function saveEditedComment(commentTextElement, originalCommentText) {
    commentTextElement.contentEditable = false;
    commentTextElement.classList.remove("editable");
    var editedText = commentTextElement.textContent;
    if (editedText.trim() === "") {
      commentTextElement.textContent = originalCommentText;
    }
  }

  function deleteComment(commentElement) {
    commentElement.remove();
  }

  function addComment(commentText, thumbsUpCount, thumbsDownCount) {
    var commentElement = createCommentElement(commentText);
    var thumbsUpCountElement = commentElement.querySelector(".upvote .vote-count");
    var thumbsDownCountElement = commentElement.querySelector(".downvote .vote-count");

    updateVoteCount(thumbsUpCountElement, thumbsUpCount);
    updateVoteCount(thumbsDownCountElement, thumbsDownCount);

    commentsList.appendChild(commentElement);
  }
});
