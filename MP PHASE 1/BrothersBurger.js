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
    ownerNameElement.textContent = "Lasallian";
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

    var ratingValueElement = document.getElementById("rating-value");
    var ratingTextElement = document.createElement("p");
    ratingTextElement.textContent = "⭐ Ratings: " + ratingValueElement.textContent;
    commentElement.appendChild(ratingTextElement);

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
  profilePicture.src = "icons/admin.png";
  profilePicture.style.marginLeft = '50px';
  profilePicture.className = "profile-picture";
  childCommentContainer.appendChild(profilePicture);

  var ownerNameElement = document.createElement("p");
  ownerNameElement.textContent = "Lasallian";
  ownerNameElement.className = "owner-name";
  ownerNameElement.style.fontWeight = "bold";

  var verifiedText = document.createElement("p");
  verifiedText.className = "verifiedText";
  verifiedText.textContent = "• Replying to Lasallian";
  verifiedText.style.color = "gray";
  verifiedText.style.fontStyle = "italic";
  verifiedText.style.fontWeight = "bold";

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

  function defaultComRep(username, commentText, ratingValue, upvoteCount, downvoteCount, replyText, upvoteCountCOM, downvoteCountCOM, replyText1, upvoteCountCOM1, downvoteCountCOM1, mention, username1) {
    var editMode = false;
    var commentElement = document.createElement("div");
    commentElement.className = "comment";
  
    var profilePicture = document.createElement("img");
    profilePicture.src = "icons/admin.png";
    profilePicture.className = "profile-picture";
    commentElement.appendChild(profilePicture);
  
    var ownerNameElement = document.createElement("p");
    ownerNameElement.textContent = username;
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

    var ratingTextElement = document.createElement("p");
    ratingTextElement.textContent = "⭐ Ratings: " + ratingValue;
    commentElement.appendChild(ratingTextElement);
  
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
      var childCommentContainer = createChildCommentContainer(username, replyText);
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

    var commentStats1 = document.createElement("div");
    commentStats1.className = "comment-stats";
    var replyContainer1 = createReplyContainer1(replyText1, upvoteCountCOM1, downvoteCountCOM1, mention, username1);
    commentStats1.appendChild(replyContainer1);
    commentElement.appendChild(commentStats1);
  
    return commentElement;
  }


  function createReplyContainer1(replyText1, upvoteCountCOM1, downvoteCountCOM1, mention, username1) {
    var replyContainer1 = document.createElement("div");
    replyContainer1.className = "reply-container";
    replyContainer1.style.margin = "20px";
    replyContainer1.style.marginLeft = "auto";
    replyContainer1.style.marginTop = "5px";
    replyContainer1.style.marginBottom = "5px";

    var imageContainer1 = document.createElement("div");
    imageContainer1.className = "image-container";

    var imageElement1 = document.createElement("img");
    imageElement1.src = "icons/admin.png";
    imageElement1.style.width = "30px"; 
    imageElement1.style.height= "30px"; 
    imageElement1.style.borderRadius= "50%";
    imageElement1.style.marginRight= "10px";
    imageElement1.style.float= "left"; 
    imageElement1.style.marginLeft = "60px";

    imageContainer1.appendChild(imageElement1);

    var ownername1 = document.createElement("p");
    ownername1.textContent = username1;
    ownername1.style.fontWeight = "bold";

    replyContainer1.appendChild(imageContainer1);
    replyContainer1.appendChild(ownername1);

    var mention1 = document.createElement("p");
    mention1.textContent = mention;
    mention1.style.fontWeight="bold";
    // mention1.style.textDecoration="underline";
    mention1.style.fontStyle="italic";
    mention1.style.color="grey";

    ownername1.style.display = "inline-block";
    mention1.style.display = "inline-block";

    var replyTextElement1 = document.createElement("p");
    replyTextElement1.textContent = replyText1;
    replyTextElement1.style.marginLeft = "100px";
  
    var replyStats1 = document.createElement("div");
    replyStats1.className = "reply-stats";
  
    var editButton10 = createButton("Edit", "edit-button");
    editButton10.style.marginRight = "5px";
    editButton10.style.backgroundColor = "transparent";
    editButton10.style.border = "none";
    editButton10.style.cursor = "pointer";
    editButton10.style.padding = "2px";
    editButton10.style.fontSize = "16px";
    editButton10.style.marginLeft = "90px";

    var editMode = false;

    editButton10.addEventListener('click', function() {
      if (editMode) {
        replyTextElement1.contentEditable = false;
        editButton10.textContent = "Edit";
        editMode = false;

        saveEditedComment(replyTextElement1, originalReplyText);
      } else {
        replyTextElement1.contentEditable = true;
        replyTextElement1.classList.add("editable");
        replyTextElement1.focus();
        editButton10.textContent = "Save";
        editMode = true;
        var originalReplyText = replyTextElement1.textContent;
      }
    });
  
    var deleteButton10 = createButton("Delete", "delete-button");
    deleteButton10.style.marginRight = "5px";
    deleteButton10.style.backgroundColor = "transparent";
    deleteButton10.style.border = "none";
    deleteButton10.style.cursor = "pointer";
    deleteButton10.style.padding = "2px";
    deleteButton10.style.fontSize = "16px";

    deleteButton10.addEventListener('click', function() {
      deleteComment(replyContainer1);
    });

    var thumbsUpButton10 = createButton("▲", "upvote");

    thumbsUpButton10.addEventListener("mouseenter", function() {
      thumbsUpButton10.style.color = "black";
    });
    thumbsUpButton10.addEventListener("mouseleave", function() {
      thumbsUpButton10.style.color = "#FF5700";
    });

    thumbsUpButton10.style.marginRight = "5px";
    thumbsUpButton10.style.border = "none";
    thumbsUpButton10.style.backgroundColor = "transparent";
    thumbsUpButton10.style.cursor = "pointer";
    thumbsUpButton10.style.padding = "2px";
    thumbsUpButton10.style.fontSize = "16px";
    thumbsUpButton10.style.color = "#FF5700"

    var thumbsUpCount10 = createVoteCount();
    thumbsUpCount10.textContent = upvoteCountCOM1; 

    thumbsUpButton10.appendChild(thumbsUpCount10);
    thumbsUpButton10.addEventListener("click", function () {
      updateVoteCount(thumbsUpCount10, 1);
    });

    var thumbsDownButton10 = createButton("▼", "downvote");
    thumbsDownButton10.addEventListener("mouseenter", function() {
      thumbsDownButton10.style.color = "black";
    });

    thumbsDownButton10.addEventListener("mouseleave", function() {
      thumbsDownButton10.style.color = "#7193FF";
    });

    thumbsDownButton10.style.marginRight = "5px";
    thumbsDownButton10.style.border = "none";
    thumbsDownButton10.style.backgroundColor = "transparent";
    thumbsDownButton10.style.cursor = "pointer";
    thumbsDownButton10.style.padding = "2px";
    thumbsDownButton10.style.fontSize = "16px";
    thumbsDownButton10.style.color = "#7193FF"

    var thumbsDownCount10 = createVoteCount();
    thumbsDownCount10.textContent = downvoteCountCOM1; 

    thumbsDownButton10.appendChild(thumbsDownCount10);
    thumbsDownButton10.addEventListener("click", function () {
      updateVoteCount(thumbsDownCount10, 1);
    });
    
    replyStats1.appendChild(editButton10);
    replyStats1.appendChild(deleteButton10);
    replyStats1.appendChild(thumbsUpButton10);
    replyStats1.appendChild(thumbsDownButton10);
    replyContainer1.appendChild(mention1);
    replyContainer1.appendChild(replyTextElement1);
    replyContainer1.appendChild(replyStats1);
  
    return replyContainer1;
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
    imageElement.src = "24chickenPICS/logo.jpg";
    imageElement.style.width = "30px"; 
    imageElement.style.height= "30px"; 
    imageElement.style.borderRadius= "50%";
    imageElement.style.marginRight= "10px";
    imageElement.style.float= "left"; 
    imageElement.style.marginLeft = "60px";

    imageContainer.appendChild(imageElement);

    var ownername = document.createElement("p");
    ownername.textContent = "24 Chicken ©";
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
  
  function createChildCommentContainer(username,replyText) {
    var childCommentContainer = document.createElement('div');
    childCommentContainer.classList.add('comment');

    var profilePicture = document.createElement("img");
    profilePicture.src = "icons/admin.png";
    profilePicture.style.marginLeft = '50px';
    profilePicture.className = "profile-picture";
    childCommentContainer.appendChild(profilePicture);

    var ownerNameElement = document.createElement("p");
    ownerNameElement.textContent = "Lasallian";
    ownerNameElement.className = "owner-name";
    ownerNameElement.style.fontWeight = "bold";

    var verifiedText = document.createElement("p");
    verifiedText.className = "verifiedText";
    // verifiedText.textContent = "©";
    verifiedText.textContent = "• Replying to "+username;
    verifiedText.style.color = "gray";
    verifiedText.style.fontStyle = "italic";
    verifiedText.style.fontWeight = "bold";

    //here
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
  var username = "John";
  var commentText = "Brothers Burger is hands down the best burger joint I have ever been to. The quality of their ingredients is exceptional, and the taste is out of this world. The buns are perfectly toasted, the meat is juicy and flavorful, and the toppings are fresh. The staff is friendly and the service is quick. I can't recommend Brothers Burger enough!";
  var ratingValue = "5 out of 5";
  var upvoteCount = 100;
  var downvoteCount = 30;
  var repceo = "Thank you for your glowing 5-star review! We're thrilled to hear that you enjoyed our burgers and had a great experience at Brothers Burger.";
  var upvoteCountCOM = 23;
  var downvoteCountCOM = 2;
  var replyText1 = "It sounds like a tantalizing experience for your taste buds. I can almost imagine myself being enveloped by the savory aroma of the perfectly seasoned chicken. Now I'm curious to know more about this amazing chicken restaurant and what other delightful dishes they have on their menu.";
  var upvoteCountCOM1 = 3;
  var downvoteCountCOM1 = 2;
  var mention = "• Replying to John"
  var username1 = "Kovie"
  var commentElement = defaultComRep(username, commentText, ratingValue, upvoteCount, downvoteCount, repceo, upvoteCountCOM, downvoteCountCOM, replyText1, upvoteCountCOM1, downvoteCountCOM1, mention, username1);
  document.getElementById("comments-list").appendChild(commentElement);

  // example 2
  var username = "Jane";
  var commentText = "I had high expectations for Brothers Burger, but unfortunately, it fell short. The burger I ordered was quite dry, and the flavors didn't come together as I had hoped. The portion size was also smaller than expected for the price. The service was average, but nothing memorable. Overall, I was disappointed with my experience.";
  var ratingValue = "3 out of 5";
  var upvoteCount = 10;
  var downvoteCount = 55;
  var repceo = "We appreciate your feedback and apologize for falling short of your expectations. Thank you for sharing your thoughts.";
  var upvoteCountCOM = 6;
  var downvoteCountCOM = 20;
  var replyText1 = "Your description of the chicken dishes has me salivating!";
  var upvoteCountCOM1 = 3;
  var downvoteCountCOM1 = 2;
  var mention = "• Replying to Jane"
  var username1 = "Kovie"
  var commentElement = defaultComRep(username, commentText, ratingValue, upvoteCount, downvoteCount, repceo, upvoteCountCOM, downvoteCountCOM, replyText1, upvoteCountCOM1, downvoteCountCOM1, mention, username1);
  document.getElementById("comments-list").appendChild(commentElement);

  // example 3
  var username = "Billie";
  var commentText = "Brothers Burger offers a decent burger with a good range of options. The patties are flavorful, and the toppings are fresh. The ambiance of the restaurant is pleasant, and the staff is attentive. While it's not the best burger I've ever had, it's definitely worth a visit if you're in the mood for a solid burger.";
  var ratingValue = "5 out of 5";
  var upvoteCount = 10;
  var downvoteCount = 5;
  var repceo = "Thank you for your 4-star review! We're glad you found our burgers flavorful and enjoyed the overall experience at Brothers Burger.";
  var upvoteCountCOM = 3;
  var downvoteCountCOM = 2;
  var replyText1 = "Your comment perfectly captures the essence of the chicken at this place";
  var upvoteCountCOM1 = 3;
  var downvoteCountCOM1 = 2;
  var mention = "• Replying to Billie"
  var username1 = "John"
  var commentElement = defaultComRep(username, commentText, ratingValue, upvoteCount, downvoteCount, repceo, upvoteCountCOM, downvoteCountCOM, replyText1, upvoteCountCOM1, downvoteCountCOM1, mention, username1);
    document.getElementById("comments-list").appendChild(commentElement);

  // example 4
  var username = "Kovie";
  var commentText = "My visit to Brothers Burger was a complete letdown. The burger I ordered was overcooked and tasted like rubber. The bun was stale, and the overall presentation was unappealing. The service was slow, and the staff seemed disinterested. I would not recommend wasting your money at this establishment.";
  var ratingValue = "3 out of 5";
  var upvoteCount = 10;
  var downvoteCount = 5;
  var repceo = "We apologize for the disappointing experience you had at our restaurant. Your feedback is important to us, and we'll work on improving.";
  var upvoteCountCOM = 3;
  var downvoteCountCOM = 2;
  var replyText1 = "Flavorful chicken and generous portions sound like a winning combination! And of course, excellent service is always a bonus, as it adds to the overall dining experience.";
  var upvoteCountCOM1 = 3;
  var downvoteCountCOM1 = 2;
  var mention = "• Replying to Kovie"
  var username1 = "Lasallian"
  var commentElement = defaultComRep(username, commentText, ratingValue, upvoteCount, downvoteCount, repceo, upvoteCountCOM, downvoteCountCOM, replyText1, upvoteCountCOM1, downvoteCountCOM1, mention, username1);
    document.getElementById("comments-list").appendChild(commentElement);

  // example 5
  var username = "Lasallian";
  var commentText = "I am a huge fan of Brothers Burger! Every time I visit, I am blown away by the quality of their burgers. The flavors are incredible, and the portions are generous. The staff is friendly and accommodating, and the restaurant has a cozy atmosphere. Brothers Burger has become my go-to place for a delicious and satisfying burger.";
  var ratingValue = "5 out of 5";
  var upvoteCount = 5;
  var downvoteCount = 5;
  var repceo = "Thank you for being a loyal fan of Brothers Burger! We're delighted to hear that you love our burgers and appreciate your continued support.";
  var upvoteCountCOM = 3;
  var downvoteCountCOM = 2;
  var replyText1 = "I appreciate your honest feedback about your experience at this chicken place. It's disappointing when our expectations aren't met, especially when it comes to food :((";
  var upvoteCountCOM1 = 3;
  var downvoteCountCOM1 = 2;
  var mention = "• Replying to Lasallian"
  var username1 = "Bobby"
  var commentElement = defaultComRep(username, commentText, ratingValue, upvoteCount, downvoteCount, repceo, upvoteCountCOM, downvoteCountCOM, replyText1, upvoteCountCOM1, downvoteCountCOM1, mention, username1);
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
