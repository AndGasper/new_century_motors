/*global MessageBoardApi _config*/
var MessageBoardApi = window.MessageBoardApi || {};

(function postWrapper($) {
    var authToken;
    MessageBoardApi.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            // Get token for anonymous user
            // window.location.href = '/register.html';
            authToken = 'abc';
        }
    }).catch(function handleTokenError(error) {
    alert(error);
    });
/**
 * postsArray - global array to hold student objects
 * @type {Array}
 */
let postsArray = [];

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
let submissionTitle = $("#submissionTitle").val();
let submissionBody = $("#submissionBody").val();
let dealership = $("#dealershipDropDown :selected").text();
let group = $("#groupDropDown :selected").text();


/**
 * addClicked = Event Handler when user clicks the add button, should a
 */
function addClicked(event) {
    event.preventDefault();
    addPost();
};
/**
 * @name - cancelClicked - Event Handler when user clicks the cancel button, should clear out title and post body
 */
function cancelClicked() {
    clearAddPostForm($("#submissionTitle"),$("#submissionBody"));
};

/**
 * @name - addPost - creates a post object based on input fields in the form and adds the object to global post array
 * @return undefined
 */
function addPost() {

    let post = {
        submissionTitle: $("#submissionTitle").val(),
        submissionBody: $("#submissionBody").val(),
        dealership: $("#dealershipDropDown :selected").text(),
        group: $("#groupDropDown :selected").text(),
    };

    let titleFeedback = $("<div class='titleFeedback'>").addClass("form-control-feedback").text("Post titles must be at least two (2) characters long");
    let bodyFeedback = $("<div class='bodyFeedback'>").addClass("form-control-feedback").text("Valid submissions are at least one hundred forty (140) characters");
    if (post.submissionTitle === '' && post.submissionBody === '') {

        // Warn the user about empty fields
        $("#submissionTitleDiv").addClass('has-warning');
        $("#submissionTitleDiv").append(titleFeedback);
        //Warn the user about empty course fields
        $("#submissionBodyDiv").addClass('has-warning');
        $("#submissionBodyDiv").append(bodyFeedback);

    }
    // Post validation checks. Could be moved into a helper function
    if (post.submissionTitle !== '' && post.submissionBody !== '') {
        if (post.submissionTitle.length >= 2 && (post.submissionBody.length > 0)) {
            postsArray.push(post);
            clearAddPostForm($("#submissionTitle"), $("#submissionBody"));
            createPost(post);
        } else {
            if (post.submissionBody.length < 140) {
                $("#submissionBody").addClass('has-warning');
            }
        }
    }

}
/**
 * @name - clearAddPostForm - clears out the form values based on inputIds variable
 */
function clearAddPostForm(postTitle, postBody) {
    $(postTitle).val("");
    $(postBody).val("");

    $("#submissionTitleDiv").removeClass('has-danger');
    $("#submissionTitleDiv").removeClass('has-warning');

    $("#submissionBodyDiv").removeClass("has-danger");
    $("#submissionBodyDiv").removeClass("has-warning");

    $("#submissionTitleDiv").removeClass('has-success');
    $("#submissionBodyDiv").removeClass("has-success");

    $(".titleFeedback").remove();
    $(".bodyFeedback").remove();
}

/**
 * updateData - centralized function to update the list of posts
 * @params - arrayOfPosts (an array of objects; [{id: , submissionTitle: , submissionBody: }])
 */
function updateData(arrayOfPosts) {
    postArray = []; // Empty out the student array before adding to it again
    for (let i = 0; i < arrayOfPosts.length; i++) {
    postArray.push(arrayOfPosts[i]);
    }
    addPostToDom(arrayOfPosts);
}


/**
 * @name - reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    postsArray = [];
    submissionTitle = $("#submissionTitle").val("");
    submissionBody = $("#submissionBody").val("");

}


/**
 * @name - replyToPostModal
 */
function replyToPostModal() {

    // var postInfo = posts_array[$(this).parent().parent().index()];
    var postInfo = $(this).parent().parent()["0"].id;
    // console.log('postInfo', postInfo);


    // Modal form
    // Modal frame
    let modalFade = $("<div class='modal' id='replyToPostModal' tabindex='-1' role='dialog' aria-labelledby='replyToPostModalLabel' aria-hidden='true'>");
    let modalDialog = $("<div class='modal-dialog' role='document'>");
    let modalContent = $("<div>").addClass("modal-content");
    let modalHeader = $("<div>").addClass("modal-header");// .text("Modal Header");
    let modalTitle = $("<div>").addClass("modal-title").text("Reply to Post");
    let closeModalButton = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>");
    let closeModalButtonSymbol = $("<span aria-hidden='true'>").text("x");
    closeModalButton.append(closeModalButtonSymbol);

    modalHeader.append(modalTitle);
    modalHeader.append(closeModalButton);
    modalContent.append(modalHeader);

    let modalBody = $("<form id='replyForm'>").addClass("modal-body");

    // Reply title input field
    let modalBodyContentReplyTitle = $("<div class='form-group' id='replyTitleDiv'>");
    let modalBodyContentReplyTitleLabel = $("<label for='Reply Title' class='form-control-label'>").text("Reply Title");
    let modalBodyContentReplyTitleField = $("<input type='text' id='replyTitle' class='form-control' onChange=''>");
    modalBodyContentReplyTitle.append(modalBodyContentReplyTitleLabel);
    modalBodyContentReplyTitle.append(modalBodyContentReplyTitleField);

    // Reply Body input field
    let modalBodyContentReplyBody = $("<div class='form-group' id='replyBodyDiv'>"); // Create form group
    let modalBodyContentReplyBodyLabel = $("<label for='Reply Body' class='form-control-label'>").text("Reply Body"); // Label for course
    let modalBodyContentReplyBodyField = $("<input type='text' id='replyBody' class='form-control' onChange=''>");

    modalBodyContentReplyBody.append(modalBodyContentReplyBodyLabel);
    modalBodyContentReplyBody.append(modalBodyContentReplyBodyField);

    modalBody.append(modalBodyContentReplyTitle);
    modalBody.append(modalBodyContentReplyBody);

    modalContent.append(modalBody);

    let modalFooter = $("<div>").addClass("modal-footer");
    let cancelReplyButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
    cancelReplyButton.text("Cancel");

    let replyButton = $("<button  class='btn btn-primary' data-dismiss='modal'>");


    replyButton.on("click", () => {
        replyToPost(postInfo);
    }); // Anonymous function to avoid firing as soon as modal loads
    replyButton.text("Reply");
    modalFooter.append(cancelReplyButton);
    modalFooter.append(replyButton);
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);

    $(modalFade).modal("show");
    // When the modal hides, call the remove method to remove the modal from the DOM which clears the form after use
    $(modalFade).on('hidden.bs.modal',() => {
       $(modalFade).remove();
        $("#replyTitleDiv, #replyBodyDiv").removeClass("has-success");
    });
}

/**
 * @name - serverErrorModal - Modal with contextual message appears on screen following server-side error.
 * @param errorType {array}
 */

function serverErrorModal(errorType) {
    updateData([]); // Empty out the DOM by passing in an empty array.
    var defaultErrorMessage = "There was a problem processing your request."; // Default error message
    //errorType = response.errors array
    switch(errorType[0]) {
        case("no data"):
            var errorMessage = "Looks like the posts are empty! Add a post to explore more features"; // var instead of let because of scoping, and var instead of const because const cannot be reassigned.
            break;

        default:
            errorMessage = defaultErrorMessage; // A little redundant but explicit

    }

    // Modal frame
    let modalFade = $("<div class='modal fade' id='serverErrorModal' tabindex='-1' role='dialog' aria-labelledby='serverErrorModalLabel' aria-hidden='true'>");
    let modalDialog = $("<div class='modal-dialog' role='document'>");
    let modalContent = $("<div>").addClass("modal-content"); // Modal content
    let modalHeader = $("<div>").addClass("modal-header").text(errorMessage); // Modal header
    let modalTitle = $("<div>").addClass("modal-title");
    let closeModalButton = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>");
    let closeModalButtonSymbol = $("<span aria-hidden='true'>").text("x");
    closeModalButton.append(closeModalButtonSymbol);

    modalHeader.append(modalTitle);
    modalHeader.append(closeModalButton);
    modalContent.append(modalHeader);
    let modalFooter = $("<div>").addClass("modal-footer"); // No content in the footer, but it gives the modal a nice shape
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);

    $(modalFade).modal("show");
    // When the modal hides, call the remove method to remove the modal from the DOM
    $(modalFade).on('hidden.bs.modal',() => {
        $(modalFade).remove();
    });

}

/**
* @name - replyToPost - Use information from the modal to send info to the server
* @param originalPostId
 */
function replyToPost(originalPostId) {

    let replyInfo = {
        id: originalPostId,
        title: $("#replyTitle").val(),
        body: $("#replyBody").val(),
    };
    // console.log('replyInfo', replyInfo);
    if (replyInfo.title === '' && replyInfo.body === '') {
        $("#replyTitleDiv").addClass('has-warning');
        $("#replyBodyDiv").addClass('has-warning')

    }
    if (replyInfo.title !== '' && replyInfo.body !== '') {
        if (replyInfo.title.length > 2 && replyInfo.body.length < 10000) {
            // console.log('replyInfo', replyInfo);
            sendReplyToPost(replyInfo);
        }
    }

}
/**
 * getDataFromServer - Get post data from the server; Notify user if no data is available
 */
function getDataFromServer() {

    let pendingAlert = $("<div class='alert alert-info' style='text-align: center'>").append('<strong>Loading posts</strong>');
    $("body").append(pendingAlert);


    // ajax call with data, dataType, method, url, and success function
    $.ajax({
        url: _config.api.invokeUrl + '/posts',
        dataType: "json",
        method: "GET",
        headers: {
            Authorization: authToken,
        },
        contentType: 'application/json',
        success: completeRequest,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error getting posts from server: ', textStatus, ', Details: ', errorThrown);
            console.error('Response: ', jqXHR.responseText);
            alert('An error occurred when contacting the server:\n' + jqXHR.responseText);
        }
    });
}

function sendReplyToPost(replyPost) {
    let pendingAlert = $("<div class='alert alert-warning' style='text-align: center'>").append('<strong>Submitting post</strong>');
    $("body").append(pendingAlert);
    // console.log("sendReplyToPost", replyPost);
    $.ajax({
        method: 'POST',
        url: _config.api.invokeUrl + '/posts',
        headers: {
            Authorization: authToken,
        },
        data: JSON.stringify(replyPost),
        contentType: 'application/json',
        success: handleReply,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error creating post: ', textStatus, ', Details: ', errorThrown);
            console.error('Response: ', jqXHR.responseText);
            alert('An error occurred when creating your post:\n' + jqXHR.responseText);
        }
    });
}
/**
 * @name createPost
 * @param {} post 
 */
function createPost(post) {
    let pendingAlert = $("<div class='alert alert-warning' style='text-align: center'>").append('<strong>Submitting post</strong>');
    $("body").append(pendingAlert);
    // submissionTitle, submissionBody, dealership, group
    $.ajax({
        method: 'POST',
        url: _config.api.invokeUrl + '/posts',
        headers: {
            Authorization: authToken,
        },
        data: JSON.stringify(post),
        contentType: 'application/json',
        success: getDataFromServer,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error creating post: ', textStatus, ', Details: ', errorThrown);
            console.error('Response: ', jqXHR.responseText);
            alert('An error occurred when creating your post:\n' + jqXHR.responseText);
        }
    });
}

function handleReply(result) {
    $('.posts-list-container').children().remove();
    getDataFromServer();
    return;
}

function completeRequest(result) {
    // console.log('Response received from API: ', result);
    $('.alert').remove(); // Remove the submitting alert.
    // Assume result.data is *JUST* the posts for a given dealership 
    if (result.data) {
        $('.posts-list-container').children().remove();
        var sortedPosts = sortPostsByGroupAndDealership(result.data); // Pull the unique groups from the messages
        // console.log("sortedPosts", sortedPosts);
        var groups = Object.keys(sortedPosts);
        for (var i = 0; i < groups.length; i++) {
            appendGroupToPage(groups[i]);
            var dealerships = Object.keys(sortedPosts[groups[i]]);
            for (var j = 0; j < dealerships.length; j++) {
                appendDealershipToGroup(dealerships[j], groups[i]); 
                // Pagination logic
                var dealershipPosts = sortedPosts[groups[i]][dealerships[j]]["posts"];
                var totalPostsPerPage = 3;
                var totalPosts = dealershipPosts.length;
                var totalPages = calculateTotalNumberOfPagesPerDealership(totalPosts, totalPostsPerPage); // The numbner of posts per page is set inside of here
                var pageSortedPosts = paginatePosts(dealershipPosts, totalPostsPerPage); // {page1: [post, post, post], page2: [post, post]} }
                var pages = $('<div>').addClass('container');
                var pageNavBar = $(`<ul>`).addClass('pagination');
                for (var k = 1; k <= totalPages; k++) {
                    var pageOfPosts = buildPageOfPosts(pageSortedPosts[`page${k}`]);
                    var pageId = buildPageId(groups[i], dealerships[j], k); 
                    var pageContainer = $('<div>').attr({id: pageId});
                    pageContainer.addClass('pageContainer');
                    if (k === 1) {
                        pageContainer.addClass('active'); // Set the initial visibility for the page to active
                    } else {
                        pageContainer.addClass('inactive');
                    }
                    
                    var pageNavItem = buildPaginationNavItem(pageId, k);
                    pageNavBar[0].appendChild(pageNavItem[0]);
                    pageOfPosts.map(function(item, index) {
                        pageContainer[0].appendChild(item); 
                    });
                    pages[0].appendChild(pageContainer[0]);
                }
                pages[0].appendChild(pageNavBar[0]);
                console.log('pages', pages); 
                appendPostsToDom(groups[i], dealerships[j], pages);
            }

        }
        // For focusing the page to the post when linked to from email. This will be problematic for pagination
        if (window.location.hash) {
            const postId = window.location.hash.slice(1);
            toggleFocusBadge(postId);
        }
        return;
    }
     else {
        result.errors = [];
        serverErrorModal(result.errors); // response.data is an array of objects)
    }

}

function appendPostsToDom(groupName, dealershipName, pages) {
    var groupId = trimWhiteSpaceAndConvertSpaceToDash(groupName);
    var dealershipId = trimWhiteSpaceAndConvertSpaceToDash(dealershipName); 
    $(`#${groupId} > #${dealershipId}`)[0].appendChild(pages[0]);
}

/**
 * @name buildPageId
 * @param {string} groupName - The name of the group
 * @param {string} dealershipName - The name of the dealership
 * @param {int} pageNumber - The number of the page passed in 
 * @description - Format the group+dealer+page number so the pages can have unique ids
 * 
 * @return {string} pageId
 */
function buildPageId(groupName, dealershipName, pageNumber) {
    var groupId = trimWhiteSpaceAndConvertSpaceToDash(groupName);
    var dealershipId = trimWhiteSpaceAndConvertSpaceToDash(dealershipName); 

    var pageId = `${groupId}-${dealershipId}-${pageNumber}`;

    return pageId;
}

/**
 * @name buildPaginationNavItem
 * @param {string} pageId - pageId references the page for the dom
 * @param {int} pageNumber for the text that appears inside of the <li>, e.g. <li>1</li>
 */
function buildPaginationNavItem(pageId, pageNumber) {
    var pageNavItem = $(`<li><a href=${pageId}>${pageNumber}</a></li>`);
    $(pageNavItem).on('click', function(event) {
        event.preventDefault();
        var pageContainerDom = $(event.currentTarget).parent().parent()[0];
        var currentPage = $(pageContainerDom).find('.active');
        var currentPageId = $(currentPage).attr('id')
        goToPage(currentPageId, pageId);
    });

    return pageNavItem
}

function goToPage(currentPage, nextPage) {
    // console.log('goToPage this:', this);
    // console.log('gotToPage', nextPage);
    toggleVisibility(currentPage); 
    toggleVisibility(nextPage);
}

/**
 * @name getClasses
 * @param {string} classNames - string of class names 
 * @description - takes in a string of class names and splits them at the space
 * @return {array} of class names
 */
function getClasses(classNames) {
    return classNames.split(' ');
}

function isActive(classes) {
    var isActive = false; // Assume the element does not have the class
    classes.map(function(item) {
        if (item === 'active') {
            isActive = true;
        }
    });
    return isActive;
}

function toggleVisibility(pageId) {
    var page = $(`#${pageId}`);
    pageClasses = getClasses($(page).attr('class')); 
    // If the passed in page was active (active) -> set it to inactive (invisible (odd word))
    if (isActive(pageClasses)) {
        page.removeClass('active');
        page.addClass('inactive');
    } else {
        page.removeClass('inactive');
        page.addClass('active');
    }   
}


/**
 * @name paginatePosts
 * @param {array} posts 
 * @param {int} postsPerPage 
 * @return {object} pages - Object with keys of page1, page2, ..., pagei and values pf the posts 
 */
function paginatePosts(posts, postsPerPage) {
    var pages = {};
    var totalPosts = posts.length;
    var pageNumber = 1; 
    for (var i = 0; i < totalPosts; i += postsPerPage) {
        // console.log('posts.slice(i, i+postsPerPage)', posts.slice(i, i+postsPerPage));
        pages[`page${pageNumber}`] = posts.slice(i, i+postsPerPage);
        pageNumber += 1; // Incrememnt the page number after slicing 
    }
    return pages; 
  }

/**
 * @name buildPaginationNav
 * @param {int} numberOfPages 
 * @description Build the little pagination nav bar thing 
 * @return {HTML | DOM Nodes} paginationLabel
 */
function buildPaginationNav(numberOfPages) {
    var paginationLabel = $(`<ul>`).addClass('pagination');
    // Arrays may start at 0, but people expect pages to start at 1
    for (i = 1; i <= numberOfPages; i++) {
        var pageNumber = $(`<li><a href="#">${i}</a></li>`);
        paginationLabel[0].appendChild(pageNumber[0]);
    }

    return paginationLabel;
    
}

function trimWhiteSpaceAndConvertSpaceToDash(stringWithSpaces) {
    
    var editedString = stringWithSpaces.trim();
    editedString = stringWithSpaces.replace(/\s/g, '-');
    return editedString;
}

function appendGroupToPage(groupName) {
    var groupRow = $("<div>").addClass("row");
    var groupId = trimWhiteSpaceAndConvertSpaceToDash(groupName);
    groupRow.attr({'id': groupId});
    var groupHeader = $("<h2>");
    groupHeader.text(groupName);
    groupRow[0].appendChild(groupHeader[0]);
    $('.posts-list-container')[0].appendChild(groupRow[0]);
    return;
}

function appendDealershipToGroup(dealershipName, groupName) {
    var dealershipRow = $("<div>").addClass("row");
    var groupId = trimWhiteSpaceAndConvertSpaceToDash(groupName);
    var dealershipId = trimWhiteSpaceAndConvertSpaceToDash(dealershipName);
    dealershipRow.attr({
        'id': dealershipId,
        'class': 'col-sm-12 dealershipRow'
    });
    
    var dealershipHeader = $("<h3>");

    dealershipHeader.text(dealershipName);
    dealershipRow[0].appendChild(dealershipHeader[0]);
    $(`#${groupId}`)[0].appendChild(dealershipRow[0]);
    return;
}

/**
 * @name sortPostsByGroupAndDealership
 * @description - Iterate over the posts and pull out the unique ids and dealerships from the posts, then push the posts into the dealerships
 * @param {array | object} posts 
 * @return {object (group) | object (dealership) | array (posts) | object (single post) } sortedPosts
 */
function sortPostsByGroupAndDealership(posts) {
    var uniqueGroups = {}; // Start with empty object 
    var allPosts = posts.length;
    for (var i = 0; i < allPosts; i++) {
        var groupName = posts[i]["Post"]["group"];
        var dealershipName = posts[i]["Post"]["dealership"];
        // Quick check to make sure group name and dealership are actually defined.
        if (groupName && dealershipName) {
            // Create the unique group
            if (!uniqueGroups[groupName]) {
                uniqueGroups[groupName] = {};
            }
            // Create unique dealerships 
            if (!uniqueGroups[groupName][dealershipName]) {
                uniqueGroups[groupName][dealershipName] = {
                    "posts": []
                };
            }

            // Now push the posts into the dealerships
            uniqueGroups[groupName][dealershipName]["posts"].push(posts[i]);
        }
    }

    var sortedPosts = uniqueGroups; 

    return sortedPosts;
}

/**
 * @name calculateTotalNumberOfPagesPerDealership
 * @param {int} totalPosts
 * @param {int} postsPerPage 
 * @return {int} numberOfPages
 */
function calculateTotalNumberOfPagesPerDealership(totalPosts, postsPerPage) {
    let totalPages = 0;
    if (totalPosts % postsPerPage === 1) {
        totalPages = parseInt(totalPosts/postsPerPage) + 1; // Round up to fit the last one on the next page
    } else {
        // Total posts is divisible by 3 
        totalPages = totalPosts/postsPerPage; 
    }

    return totalPages
}

/**
 * @name buildPageOfPosts
 * @param {*} postNodes 
 * @description - Calls appendPostToList which builds the DOM elements for the messages + replies
 * @return postsList - 
 */
function buildPageOfPosts(postNodes) {
    var postsList = []; 
    for (var i = 0; i < postNodes.length; i++) {
        // var postsList = appendPostToList(postNodes[i]); // This is where the post was getting appended to the DOM
        postsList.push(appendPostToList(postNodes[i])); 
    }
    console.log('postsList', postsList);
    return postsList;
}

/**
 * 
 * @param {object | PostId (string), Post (array) } replyNode 
 * @param {int} index 
 * @param {object | PostId (string), Post (array) } postNode 
 */
function buildReplyItem(replyNode, index) { 
    var postListItem = $("<li>"); 
    var liId = trimWhiteSpaceAndConvertSpaceToDash(replyNode.originalPost);
    postListItem.attr({
        "id": `${liId}-reply`,
        "class": "list-group-item reply"
    });
    var replyTitle = $("<h4>"); // Create post title
    replyTitle.addClass("postTitle");
    replyTitle.text(replyNode.title);
    var replyBody = $("<span class='postBody'>");
    var replyBodyText = $("<p>").text(replyNode.body);
    replyBody[0].appendChild(replyBodyText[0]);
    postListItem[0].appendChild(replyTitle[0]); // <li><h3></h3><span><p></p></span></li>
    postListItem[0].appendChild(replyBody[0]);
    
    return postListItem[0];
}

function appendPostToList(postNode) {

    if (!postNode.replies) {
        // A postNode with no replies does not need to be recursively passed over
        var post = buildPostItem(postNode);
        var groupId = trimWhiteSpaceAndConvertSpaceToDash(postNode["Post"]["group"]);
        var dealershipId = trimWhiteSpaceAndConvertSpaceToDash(postNode["Post"]["dealership"]);
        var postSection = $("<ul>"); 
        var ulId = trimWhiteSpaceAndConvertSpaceToDash(postNode["PostId"])
        postSection.attr({
            "id": `${ulId}-ul`,
            "class": "list-group"
        });
        // Append reply if auth'd
        if (window.MessageBoardApi.authToken.then(function(tokenValue) {
            if (tokenValue) {
                let operationsRow = $("<td class='btn-group-vertical'>");
                operationsRow.css("border-top", "none");
                let replyButton = $("<button type='button' class='btn btn-outline-primary' data-toggle='modal' data-target='replyToPostModal'>");
                replyButton.css("marginRight", "1em");
                replyButton.text("Reply");
                replyButton.on("click", replyToPostModal);
                operationsRow.append(replyButton);
                post[0].appendChild(operationsRow[0]);
            }    
        }));
        postSection[0].appendChild(post[0]);

        if (postNode["Post"]["replies"].length !== 0) {
            postNode["Post"]["replies"].map(function(item, index) {
                if (index % 2 === 0) {
                    var replyItem = buildReplyItem(item, index);
                    postSection[0].appendChild(replyItem);
                }
            });
        }
        // This part here needs to point to the existing page
        // $(`#${groupId} > #${dealershipId}`)[0].appendChild(postSection[0]); // Append post to the dealership section
    } 

    return postSection[0];
}

function buildPostItem(postNode) {
    var postListItem = $("<li>"); 
    postListItem.attr({
        "id": trimWhiteSpaceAndConvertSpaceToDash(postNode["PostId"]),
        "class": "list-group-item"
    });
    var postTitle = $("<h4>"); // Create post title
    postTitle.addClass("postTitle");
    postTitle.text(postNode["Post"].title);
    // console.log('postTitle', postTitle);
    
    var postBody = $("<span class='postBody'>");
    var postBodyText = $("<p>").text(postNode["Post"].body);
    postBody[0].appendChild(postBodyText[0]);
    postListItem[0].appendChild(postTitle[0]); // <li><h3></h3><span><p></p></span></li>
    postListItem[0].appendChild(postBody[0]);

    return postListItem;
}


/**
 * @name toggleFocusBadge
 * @description Takes in a postId for a valid DOM element and sets a bootstrap badge
 * @param {@string} postId 
 */
function toggleFocusBadge(postId) {
    var badge = $('<span>').attr({
        'class': 'badge badge-success'
    });
    badge.text('New Post');
    var post = document.getElementById(postId);
    $(post)[0].append($(badge)[0]);
    // Scroll into view
    $(window).scrollTo(post);
}


// [{PostId:<String>, Post: {title: String, body: String, dealership: String, group: String}}]
$(document).ready(function(){
    $('#submitComment').click(addClicked);
    $('#getDataFromServer').click(getDataFromServer);
    getDataFromServer();
    
});

}(jQuery));
