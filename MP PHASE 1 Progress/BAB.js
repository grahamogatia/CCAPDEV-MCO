document.addEventListener("DOMContentLoaded", function() {
  var commentForm = document.getElementById("review-form");
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
    ownerNameElement.textContent = "User's Name";
    ownerNameElement.className = "owner-name";
    ownerNameElement.style.fontWeight = "bold";

    var verifiedText = document.createElement("p");
    verifiedText.className = "verifiedText";
    
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
    var editMode = false; 
    var editCommentText; 
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

    var replyButton = createButton("Reply", "reply-button");
    replyButton.addEventListener("click", function() {
      openReplyForm();
    });

function openReplyForm() {
  var index = Array.from(commentElement.parentElement.children).indexOf(commentElement);
  var popup = document.createElement("div");
  popup.className = "popup";

  var textarea = document.createElement("textarea");
  textarea.id = "replyText";
  textarea.placeholder = "Enter owner's response...";
  popup.appendChild(textarea);

  var buttonContainer = document.createElement("div");
  buttonContainer.className = "reply-button-container";

  var submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.className = "button";
  submitButton.addEventListener("click", function() {
    submitReply(index);
    closePopup();
  });

  var closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.className = "button";
  closeButton.addEventListener("click", closePopup);

  buttonContainer.appendChild(submitButton);
  buttonContainer.appendChild(closeButton);

  popup.appendChild(buttonContainer);

  document.body.appendChild(popup);
}

function submitReply(index) {
  var replyText = document.getElementById("replyText").value;
  document.getElementById("replyText").value = ""; 
  postReply(index, replyText);
}

function postReply(index, replyText) {
  var parentCommentContainer = document.getElementById('comments-list').children[index];
  var childCommentContainer = createChildCommentContainer(replyText);

  parentCommentContainer.appendChild(childCommentContainer);
}

function saveEditedComment(commentTextElement, originalCommentText) {
  commentTextElement.contentEditable = false;
  commentTextElement.classList.remove("editable");
  var editedText = commentTextElement.textContent;
  
  var existingEditedNote = commentTextElement.querySelector(".edited-note");
  if (existingEditedNote) {
    existingEditedNote.remove();
  }
  
  if (editedText.trim() === "") {
    commentTextElement.textContent = originalCommentText;
  } else if (editedText !== originalCommentText) {
    var editedNote = document.createElement("span");
    editedNote.textContent = " (edited)";
    editedNote.className = "edited-note";
    editedNote.style.color = "grey";
    commentTextElement.appendChild(editedNote);
  }
}

function deleteComment(commentElement) {
  commentElement.remove();
}

function createChildCommentContainer(replyText) {
  var childCommentContainer = document.createElement('div');
  childCommentContainer.classList.add('comment');

  var profilePicture = document.createElement("img");
  profilePicture.src = "BAB/logo.png";
  profilePicture.style.marginLeft = '50px';
  profilePicture.className = "profile-picture";
  childCommentContainer.appendChild(profilePicture);

  var ownerNameElement = document.createElement("p");
  ownerNameElement.textContent = "BAB Korean Restaurant";
  ownerNameElement.className = "owner-name";
  ownerNameElement.style.fontWeight = "bold";

  var verifiedText = document.createElement("p");
  verifiedText.className = "verifiedText";
  verifiedText.textContent = "©";

  var ownerContainer = document.createElement("div");
  ownerContainer.className = "owner-container";
  ownerContainer.appendChild(ownerNameElement);
  ownerContainer.appendChild(verifiedText);
  childCommentContainer.appendChild(ownerContainer);

  var replyContent = document.createElement('p');
  replyContent.classList.add('reply-text');
  replyContent.style.marginLeft = '80px';
  replyContent.innerText = replyText;
  childCommentContainer.appendChild(replyContent);

  var commentActionsContainer = document.createElement('div');
  commentActionsContainer.classList.add('comment-actions');
  commentActionsContainer.style.marginLeft = '80px';
  childCommentContainer.appendChild(commentActionsContainer);

  var editButton = createButton("Edit", "edit-button");
  var deleteButton = createButton("Delete", "delete-button");

  editButton.addEventListener('click', function () {
    if (editMode) {
      saveEditedComment(replyContent, editReplyText);
      editButton.textContent = "Edit";
      editMode = false;
    } else {
      editReplyText = replyContent.textContent;
      replyContent.contentEditable = true;
      replyContent.classList.add("editable");
      editButton.textContent = "Save";
      editMode = true;
    }
  });

  deleteButton.addEventListener('click', function () {
    deleteComment(childCommentContainer);
  });

  commentActionsContainer.appendChild(editButton);
  commentActionsContainer.appendChild(deleteButton);

  var upvoteButton = document.createElement('button');
  upvoteButton.classList.add('upvote');
  upvoteButton.innerHTML = '▲';
  commentActionsContainer.appendChild(upvoteButton);

  var upvoteCount = document.createElement('span');
  upvoteCount.classList.add('vote-count');
  upvoteCount.innerText = '0';
  commentActionsContainer.appendChild(upvoteCount);

  var downvoteButton = document.createElement('button');
  downvoteButton.classList.add('downvote');
  downvoteButton.innerHTML = '▼';
  commentActionsContainer.appendChild(downvoteButton);

  var downvoteCount = document.createElement('span');
  downvoteCount.classList.add('vote-count');
  downvoteCount.innerText = '0';
  commentActionsContainer.appendChild(downvoteCount);

  upvoteButton.addEventListener('click', function () {
    incrementVote(upvoteCount);
  });

  downvoteButton.addEventListener('click', function () {
    incrementVote(downvoteCount);
  });

  return childCommentContainer;
}

function updateReplyContent(replyContentElement, updatedText) {
  var updatedReplyContent = document.createElement("p");
  updatedReplyContent.classList.add("reply-text");
  updatedReplyContent.style.marginLeft = "80px";
  updatedReplyContent.innerText = updatedText;

  var editContainer = replyContentElement.parentNode;
  editContainer.parentNode.replaceChild(updatedReplyContent, editContainer);
}

function cancelEdit(replyContentElement, editContainer) {
  editContainer.parentNode.replaceChild(replyContentElement, editContainer);
}

function deleteComment(commentContainer) {
  var parentCommentContainer = commentContainer.parentNode;
  var ownerContainer = parentCommentContainer.querySelector(".owner-container");

  commentContainer.remove();

  if (ownerContainer) {
    ownerContainer.remove();
  }
}

    function closePopup() {
      var popup = document.querySelector(".popup");
      popup.parentNode.removeChild(popup);
    }

    commentActions.appendChild(editButton);
    commentActions.appendChild(deleteButton);
    commentActions.appendChild(replyButton);
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

  function incrementVote(voteCountElement) {
    var currentCount = parseInt(voteCountElement.innerText);
    voteCountElement.innerText = currentCount + 1;
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
    
    var existingEditedNote = commentTextElement.querySelector(".edited-note");
    if (existingEditedNote) {
      existingEditedNote.remove(); 
    }
    
    if (editedText.trim() === "") {
      commentTextElement.textContent = originalCommentText;
    } else if (editedText !== originalCommentText) {
      var editedNote = document.createElement("span");
      editedNote.textContent = " (edited)";
      editedNote.className = "edited-note";
      editedNote.style.color = "grey";
      commentTextElement.appendChild(editedNote);
    }
  }

  function saveEditedComment(commentTextElement, originalCommentText) {
    commentTextElement.contentEditable = false;
    commentTextElement.classList.remove("editable");
    var editedText = commentTextElement.textContent;
    
    var existingEditedNote = commentTextElement.querySelector(".edited-note");
    if (existingEditedNote) {
      existingEditedNote.remove();
    }
    
    if (editedText.trim() === "") {
      commentTextElement.textContent = originalCommentText;
    } else if (editedText !== originalCommentText) {
      var editedNote = document.createElement("span");
      editedNote.textContent = " (edited)";
      editedNote.className = "edited-note";
      editedNote.style.color = "grey";
      commentTextElement.appendChild(editedNote); 
    }
  }

  function deleteComment(commentElement) {
    commentElement.remove();
  }










  function defaultComRep(commentText, upvoteCount, downvoteCount, replyText, upvoteCountCOM, downvoteCountCOM) {
    var editMode = false;
    var commentElement = document.createElement("div");
    commentElement.className = "comment";
  
    var profilePicture = document.createElement("img");
    profilePicture.src = "icons/admin.png";
    profilePicture.className = "profile-picture";
    commentElement.appendChild(profilePicture);
  
    var ownerNameElement = document.createElement("p");
    ownerNameElement.textContent = "User's Name";
    ownerNameElement.className = "owner-name";
    ownerNameElement.style.fontWeight = "bold";
  
    var verifiedText = document.createElement("p");
    verifiedText.className = "verifiedText";
  
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
  
    var replyButton = createButton("Reply", "reply-button");
    replyButton.addEventListener("click", function () {
      openReplyForm();
    });
  
    function openReplyForm() {
      var index = Array.from(commentElement.parentElement.children).indexOf(commentElement);
      var popup = document.createElement("div");
      popup.className = "popup";
  
      var textarea = document.createElement("textarea");
      textarea.id = "replyText";
      textarea.placeholder = "Enter owner's response...";
      popup.appendChild(textarea);
  
      var buttonContainer = document.createElement("div");
      buttonContainer.className = "reply-button-container";
  
      var submitButton = document.createElement("button");
      submitButton.textContent = "Submit";
      submitButton.className = "button";
      submitButton.addEventListener("click", function () {
        submitReply(index);
        closePopup();
      });
  
      var closeButton = createButton("Close", "button");
      closeButton.addEventListener("click", closePopup);
  
      buttonContainer.appendChild(submitButton);
      buttonContainer.appendChild(closeButton);
  
      popup.appendChild(buttonContainer);
  
      document.body.appendChild(popup);
    }
  
    function submitReply(index) {
      var replyText = document.getElementById("replyText").value;
      document.getElementById("replyText").value = ""; 
      postReply(index, replyText);
    }
  
    function postReply(index, replyText) {
      var parentCommentContainer = document.getElementById('comments-list').children[index];
      var childCommentContainer = createChildCommentContainer(replyText);
      parentCommentContainer.appendChild(childCommentContainer);
    }
  
    function closePopup() {
      var popup = document.querySelector(".popup");
      popup.remove();
    }
  
    function createButton(text, className) {
      var button = document.createElement("button");
      button.textContent = text;
      button.className = className;
      return button;
    }
  
    commentActions.appendChild(editButton);
    commentActions.appendChild(deleteButton);
    commentActions.appendChild(replyButton);
    commentElement.appendChild(commentActions);

    var thumbsUpButton11 = createButton("▲", "upvote");

    thumbsUpButton11.addEventListener("mouseenter", function() {
      thumbsUpButton11.style.color = "black";
    });
    thumbsUpButton11.addEventListener("mouseleave", function() {
      thumbsUpButton11.style.color = "#FF5700";
    });

    thumbsUpButton11.style.marginRight = "5px";
    thumbsUpButton11.style.border = "none";
    thumbsUpButton11.style.backgroundColor = "transparent";
    thumbsUpButton11.style.cursor = "pointer";
    thumbsUpButton11.style.padding = "2px";
    thumbsUpButton11.style.fontSize = "16px";
    thumbsUpButton11.style.color = "#FF5700"

    var thumbsUpCount11 = createVoteCount();
    thumbsUpCount11.textContent = upvoteCount;

    thumbsUpButton11.appendChild(thumbsUpCount11);
    thumbsUpButton11.addEventListener("click", function () {
      updateVoteCount(thumbsUpCount11, 1);
    });

    var thumbsDownButton11 = createButton("▼", "downvote");
    thumbsDownButton11.addEventListener("mouseenter", function() {
      thumbsDownButton11.style.color = "black";
    });
    
    thumbsDownButton11.style.marginRight = "5px";
    thumbsDownButton11.style.border = "none";
    thumbsDownButton11.style.backgroundColor = "transparent";
    thumbsDownButton11.style.cursor = "pointer";
    thumbsDownButton11.style.padding = "2px";
    thumbsDownButton11.style.fontSize = "16px";
    thumbsDownButton11.style.color = "#7193FF"

    var thumbsDownCount11 = createVoteCount();
    thumbsDownCount11.textContent = downvoteCount; 

    thumbsDownButton11.appendChild(thumbsDownCount11);
    thumbsDownButton11.addEventListener("click", function () {
      updateVoteCount(thumbsDownCount11, 1);
    });

    thumbsDownButton11.addEventListener("mouseleave", function() {
      thumbsDownButton11.style.color = "#7193FF";
    });
    
    commentActions.appendChild(thumbsUpButton11);
    commentActions.appendChild(thumbsDownButton11);

    var commentStats = document.createElement("div");
    commentStats.className = "comment-stats";
    var replyContainer = createReplyContainer(replyText, upvoteCountCOM, downvoteCountCOM);
    commentStats.appendChild(replyContainer);
    commentElement.appendChild(commentStats);
  
    return commentElement;
  }


  function createReplyContainer(replyText, upvoteCountCOM, downvoteCountCOM) {
    var replyContainer = document.createElement("div");
    replyContainer.className = "reply-container";
    replyContainer.style.margin = "20px";
    replyContainer.style.marginLeft = "auto";
    replyContainer.style.marginTop = "5px";
    replyContainer.style.marginBottom = "5px";

    var imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    var imageElement = document.createElement("img");
    imageElement.src = "BAB/logo.png";
    imageElement.style.width = "30px"; 
    imageElement.style.height= "30px"; 
    imageElement.style.borderRadius= "50%";
    imageElement.style.marginRight= "10px";
    imageElement.style.float= "left"; 
    imageElement.style.marginLeft = "60px";

    imageContainer.appendChild(imageElement);

    var ownername = document.createElement("p");
    ownername.textContent = "BAB Korean Restaurant ©";
    ownername.style.fontWeight = "bold";

    replyContainer.appendChild(imageContainer);
    replyContainer.appendChild(ownername);

    var replyTextElement = document.createElement("p");
    replyTextElement.textContent = replyText;
  
    var replyStats = document.createElement("div");
    replyStats.className = "reply-stats";
  
    var editButton1 = createButton("Edit", "edit-button");
    editButton1.style.marginRight = "5px";
    editButton1.style.backgroundColor = "transparent";
    editButton1.style.border = "none";
    editButton1.style.cursor = "pointer";
    editButton1.style.padding = "2px";
    editButton1.style.fontSize = "16px";
    editButton1.style.marginLeft = "90px";

    var editMode = false;

    editButton1.addEventListener('click', function() {
      if (editMode) {
        replyTextElement.contentEditable = false;
        editButton1.textContent = "Edit";
        editMode = false;

        saveEditedComment(replyTextElement, originalReplyText);
      } else {
        replyTextElement.contentEditable = true;
        replyTextElement.classList.add("editable");
        replyTextElement.focus();
        editButton1.textContent = "Save";
        editMode = true;
        var originalReplyText = replyTextElement.textContent;
      }
    });
  
    var deleteButton1 = createButton("Delete", "delete-button");
    deleteButton1.style.marginRight = "5px";
    deleteButton1.style.backgroundColor = "transparent";
    deleteButton1.style.border = "none";
    deleteButton1.style.cursor = "pointer";
    deleteButton1.style.padding = "2px";
    deleteButton1.style.fontSize = "16px";

    deleteButton1.addEventListener('click', function() {
      deleteComment(replyContainer);
    });

    var thumbsUpButton1 = createButton("▲", "upvote");

    thumbsUpButton1.addEventListener("mouseenter", function() {
      thumbsUpButton1.style.color = "black";
    });
    thumbsUpButton1.addEventListener("mouseleave", function() {
      thumbsUpButton1.style.color = "#FF5700";
    });

    thumbsUpButton1.style.marginRight = "5px";
    thumbsUpButton1.style.border = "none";
    thumbsUpButton1.style.backgroundColor = "transparent";
    thumbsUpButton1.style.cursor = "pointer";
    thumbsUpButton1.style.padding = "2px";
    thumbsUpButton1.style.fontSize = "16px";
    thumbsUpButton1.style.color = "#FF5700"

    var thumbsUpCount1 = createVoteCount();
    thumbsUpCount1.textContent = upvoteCountCOM; 

    thumbsUpButton1.appendChild(thumbsUpCount1);
    thumbsUpButton1.addEventListener("click", function () {
      updateVoteCount(thumbsUpCount1, 1);
    });

    var thumbsDownButton1 = createButton("▼", "downvote");
    thumbsDownButton1.addEventListener("mouseenter", function() {
      thumbsDownButton1.style.color = "black";
    });

    thumbsDownButton1.addEventListener("mouseleave", function() {
      thumbsDownButton1.style.color = "#7193FF";
    });

    thumbsDownButton1.style.marginRight = "5px";
    thumbsDownButton1.style.border = "none";
    thumbsDownButton1.style.backgroundColor = "transparent";
    thumbsDownButton1.style.cursor = "pointer";
    thumbsDownButton1.style.padding = "2px";
    thumbsDownButton1.style.fontSize = "16px";
    thumbsDownButton1.style.color = "#7193FF"

    var thumbsDownCount1 = createVoteCount();
    thumbsDownCount1.textContent = downvoteCountCOM; 

    thumbsDownButton1.appendChild(thumbsDownCount1);
    thumbsDownButton1.addEventListener("click", function () {
      updateVoteCount(thumbsDownCount1, 1);
    });
    
    replyStats.appendChild(editButton1);
    replyStats.appendChild(deleteButton1);
    replyStats.appendChild(thumbsUpButton1);
    replyStats.appendChild(thumbsDownButton1);
  
    replyContainer.appendChild(replyTextElement);
    replyContainer.appendChild(replyStats);
  
    return replyContainer;
  }
  
  function createChildCommentContainer(replyText) {
    var childCommentContainer = document.createElement('div');
    childCommentContainer.classList.add('comment');

    var profilePicture = document.createElement("img");
    profilePicture.src = "icons/owner.png";
    profilePicture.style.marginLeft = '50px';
    profilePicture.className = "profile-picture";
    childCommentContainer.appendChild(profilePicture);

    var ownerNameElement = document.createElement("p");
    ownerNameElement.textContent = "BAB Korean Restaurant";
    ownerNameElement.className = "owner-name";
    ownerNameElement.style.fontWeight = "bold";

    var verifiedText = document.createElement("p");
    verifiedText.className = "verifiedText";
    verifiedText.textContent = "©";

    var ownerContainer = document.createElement("div");
    ownerContainer.className = "owner-container";
    ownerContainer.appendChild(ownerNameElement);
    ownerContainer.appendChild(verifiedText);
    childCommentContainer.appendChild(ownerContainer);

    var replyContent = document.createElement('p');
    replyContent.classList.add('reply-text');
    replyContent.style.marginLeft = '80px';
    replyContent.innerText = replyText;
    childCommentContainer.appendChild(replyContent);

    var commentActionsContainer = document.createElement('div');
    commentActionsContainer.classList.add('comment-actions');
    commentActionsContainer.style.marginLeft = '80px';
    childCommentContainer.appendChild(commentActionsContainer);

    var editButton = createButton("Edit", "edit-button");
    var deleteButton = createButton("Delete", "delete-button");

    var editReplyText = "";
    var editMode = false;

    editButton.addEventListener('click', function () {
      if (editMode) {
        saveEditedComment(replyContent, editReplyText);
        editButton.textContent = "Edit";
        editMode = false;
      } else {
        editReplyText = replyContent.textContent;
        replyContent.contentEditable = true;
        replyContent.classList.add("editable");
        editButton.textContent = "Save";
        editMode = true;
      }
    });

    deleteButton.addEventListener('click', function () {
      deleteComment(childCommentContainer);
    });

    commentActionsContainer.appendChild(editButton);
    commentActionsContainer.appendChild(deleteButton);

    var upvoteButton = document.createElement('button');
    upvoteButton.classList.add('upvote');
    upvoteButton.innerHTML = '▲';
    commentActionsContainer.appendChild(upvoteButton);

    var upvoteCount = document.createElement('span');
    upvoteCount.classList.add('vote-count');
    upvoteCount.innerText = '0';
    commentActionsContainer.appendChild(upvoteCount);

    var downvoteButton = document.createElement('button');
    downvoteButton.classList.add('downvote');
    downvoteButton.innerHTML = '▼';
    commentActionsContainer.appendChild(downvoteButton);

    var downvoteCount = document.createElement('span');
    downvoteCount.classList.add('vote-count');
    downvoteCount.innerText = '0';
    commentActionsContainer.appendChild(downvoteCount);

    upvoteButton.addEventListener('click', function () {
      incrementVote(upvoteCount);
    });

    downvoteButton.addEventListener('click', function () {
      incrementVote(downvoteCount);
    });

    return childCommentContainer;
  }
  
  // example 1
  var commentText = "I recently dined at BAB Korean Restaurant and had an amazing experience. The cupbab, kimbab, and tteokbokki were all exceptionally delicious. The flavors were authentic and reminded me of the traditional Korean dishes I had in Seoul. The service was top-notch, with friendly and attentive staff who made sure we had everything we needed. I highly recommend this restaurant to anyone craving authentic Korean cuisine.";
  var upvoteCount = 13;
  var downvoteCount = 9;
  var replyText = "Thank you for sharing your positive experience at BAB Korean Restaurant! We're thrilled to hear that you enjoyed our cupbab, kimbab, and tteokbokki. It's great to know that our dishes reminded you of the authentic flavors from Seoul. We appreciate your recommendation and look forward to serving you more delicious Korean cuisine in the future!";
  var upvoteCountCOM = 29;
  var downvoteCountCOM = 12;
  var commentElement = defaultComRep(commentText, upvoteCount, downvoteCount, replyText, upvoteCountCOM, downvoteCountCOM);
  document.getElementById("comments-list").appendChild(commentElement);

  // example 2
  var commentText = "My visit to BAB Korean Restaurant was a delightful culinary journey. The cupbab, kimbab, and tteokbokki were all prepared with great care and attention to detail. The flavors were rich and satisfying, although I would have liked a bit more spice in the tteokbokki. The ambiance of the restaurant was cozy and inviting, making it a perfect place for a casual meal. Overall, I had a wonderful dining experience and would happily return.";
  var upvoteCount = 13;
  var downvoteCount = 5;
  var replyText = "Thank you for your feedback and for choosing to dine at BAB Korean Restaurant. We're glad to hear that you had a delightful culinary journey with us. We appreciate your comment about the spice level in the tteokbokki and will take it into consideration for future improvements. We hope to have the pleasure of serving you again soon!";
  var upvoteCountCOM = 16;
  var downvoteCountCOM = 2;
  var commentElement = defaultComRep(commentText, upvoteCount, downvoteCount, replyText, upvoteCountCOM, downvoteCountCOM);
  document.getElementById("comments-list").appendChild(commentElement);

  // example 3
  var commentText = "While the cupbab and kimbab at BAB Korean Restaurant were tasty, I found the tteokbokki to be a bit disappointing. The sauce lacked depth of flavor and the rice cakes were slightly overcooked. The service was decent, although the waitstaff seemed a bit overwhelmed during peak hours. The restaurant's atmosphere was pleasant, but it could benefit from some minor improvements. It's an okay place for Korean food, but there are better options available.";
  var upvoteCount = 19;
  var downvoteCount = 6;
  var replyText = "Thank you for visiting BAB Korean Restaurant and sharing your thoughts. We're glad you enjoyed the cupbab and kimbab, but we apologize for the disappointment with the tteokbokki. We appreciate your feedback regarding the sauce and rice cakes, and we will work on enhancing their flavors. We also value your comments about the service and ambiance, and we'll strive to make improvements. We hope to have another opportunity to provide you with a better experience.";
  var upvoteCountCOM = 32;
  var downvoteCountCOM = 42;
  var commentElement = defaultComRep(commentText, upvoteCount, downvoteCount, replyText, upvoteCountCOM, downvoteCountCOM);
  document.getElementById("comments-list").appendChild(commentElement);

  // example 4
  var commentText = "My experience at BAB Korean Restaurant was rather underwhelming. The cupbab and kimbab were mediocre, lacking the authentic flavors I was expecting. The tteokbokki was particularly disappointing, as it was overly greasy and lacked the traditional spicy kick. The service was slow and inattentive, and the overall atmosphere felt cramped and uncomfortable. I wouldn't recommend this restaurant if you're looking for a truly satisfying Korean dining experience.";
  var upvoteCount = 15;
  var downvoteCount = 55;
  var replyText = "We're sorry to hear that your experience at BAB Korean Restaurant fell short of your expectations. We apologize for the mediocrity of the cupbab, kimbab, and tteokbokki. Your feedback regarding the lack of authentic flavors is noted, and we will address this issue with our culinary team. We're also sorry for the slow and inattentive service and the discomfort you felt in our restaurant. We appreciate your honest feedback and will use it to improve our offerings and overall dining experience.";
  var upvoteCountCOM = 33;
  var downvoteCountCOM = 12;
  var commentElement = defaultComRep(commentText, upvoteCount, downvoteCount, replyText, upvoteCountCOM, downvoteCountCOM);
  document.getElementById("comments-list").appendChild(commentElement);

  // example 5
  var commentText = "I had a terrible dining experience at BAB Korean Restaurant. The cupbab, kimbab, and tteokbokki were all subpar, lacking in flavor and freshness. The rice in the kimbab was dry and the tteokbokki was overly mushy. The service was extremely poor, with rude and inattentive staff who seemed disinterested in providing a good dining experience. The restaurant was also poorly maintained and lacked cleanliness. I would strongly advise against visiting this establishment.";
  var upvoteCount = 55;
  var downvoteCount = 59;
  var replyText = "We're deeply sorry to hear about your terrible dining experience at BAB Korean Restaurant. We apologize for the subpar quality of our cupbab, kimbab, and tteokbokki. Your feedback regarding the lack of flavor and freshness is concerning, and we will investigate this matter with our kitchen staff. We're also sorry for the poor service, lack of cleanliness, and overall dissatisfaction you experienced. We take your comments seriously, and we will make every effort to address these issues to ensure a better dining experience for our customers. Thank you for bringing these concerns to our attention.";
  var upvoteCountCOM = 35;
  var downvoteCountCOM = 28;
  var commentElement = defaultComRep(commentText, upvoteCount, downvoteCount, replyText, upvoteCountCOM, downvoteCountCOM);
  document.getElementById("comments-list").appendChild(commentElement);



const slides = document.querySelectorAll('.slide');
const thumbnails = document.querySelectorAll('.thumbnail');

let currentSlide = 0;

function showSlide(n) {
  slides.forEach((slide) => {
    slide.style.display = 'none';
  });

  slides[n].style.display = 'block';
}

function activateThumbnail(n) {
  thumbnails.forEach((thumbnail) => {
    thumbnail.classList.remove('active');
  });

  thumbnails[n].classList.add('active');
}

function slideTo(n) {
  showSlide(n);
  activateThumbnail(n);
}

thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener('click', () => {
    slideTo(index);
  });
});

showSlide(currentSlide);
activateThumbnail(currentSlide);

});
