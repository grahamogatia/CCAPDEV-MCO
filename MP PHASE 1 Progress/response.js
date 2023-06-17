document.addEventListener("DOMContentLoaded", function() {
  var commentForm = document.getElementById("comment-form");
  var commentInput = document.getElementById("comment-input");
  var commentsList = document.getElementById("comments-list");

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
});
