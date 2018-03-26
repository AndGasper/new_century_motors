/*global MessageBoardApi _config*/
var MessageBoardApi = window.MessageBoardApi || {};

(function postWrapper($) {
    var authToken;
    MessageBoardApi.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            // Get token for anonymous user
            window.location.href = '/register.html';
        }
    }).catch(function handleTokenError(error) {
    alert(error);
    });
/**
 * student_array - global array to hold student objects
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
 * addPostToDom - take in a post object, create html elements from the values and then append the elements
 * into the .postsListTable tbody
 * @param postsArray (an array of objects)
 */
function addPostToDom(postsArray) {
    $(".postsListTable").empty(); // Empty out the table
    let keys = ["title", "body","group", "dealership"];
    for (let i = 0; i < postsArray.length; i++) {
        let postRow = $("<tr>");
        for (let j = 0; j < keys.length; j++) {
            let td = $("<td>");
            let postInfo = postsArray[i][keys[j]];
            td.append(postInfo);
            postRow.append(td);
        }
        $(".postsListTable").append(postRow);
        // let operationsRow = $("<td class='btn-group-vertical'>");
        // operationsRow.css("border-top", "none");
        // let deleteButton = $("<button>").addClass("btn btn-outline-danger").text("REMOVE");
        // let editButton = $("<button type='button' class='btn btn-outline-primary' data-toggle='modal' data-target='editStudentModal'>");
        // editButton.css("marginRight", "1em");
        // editButton.text("Edit");
        // deleteButton.on("click", removeStudentModal);
        // editButton.on("click", editStudentModal);
        // operationsRow.append(editButton);
        // operationsRow.append(deleteButton); // The formatting could use a little work
        // studentRow.append(operationsRow);

    }
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
 * @name - removePost - removes the student object from the student_array
 * @param postInfo
 */
function removePost(postInfo) {

    let postId = postsArray[postInfo]["id"];
    deleteDataFromServer(postId); // delete the student from the server based on the student's id; student_id: (id value) => formatting
}

// /**
//  * @name - removePostModal
//  */
// function removePostModal() {
//     let indexInPostArray = $(this).parent().parent().index(); // To know who to delete
//     // Modal frame
//     let modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true'>");
//     let modalDialog = $("<div class='modal-dialog' role='document'>");
//     let modalContent = $("<div>").addClass("modal-content"); // Modal content
//     let modalHeader = $("<div>").addClass("modal-header"); // Modal header
//     let modalTitle = $("<div>").addClass("modal-title").text("Are you sure you want to remove this student?");
//     let closeModalButton = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>");
//     let closeModalButtonSymbol = $("<span aria-hidden='true'>").text("x");
//     closeModalButton.append(closeModalButtonSymbol);

//     modalHeader.append(modalTitle);
//     modalHeader.append(closeModalButton);
//     modalContent.append(modalHeader);


//     let modalFooter = $("<div>").addClass("modal-footer");
//     let cancelDeleteButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
//     cancelDeleteButton.text("Cancel");
//     let confirmDeleteButton= $("<button class='btn btn-danger' data-dismiss='modal'>");

//     confirmDeleteButton.on("click", () => {
//         removeStudent(indexInStudentArray);
//     }); // Anonymous function to avoid firing as soon as modal loads
//     confirmDeleteButton.text("REMOVE");
//     modalFooter.append(cancelDeleteButton);
//     modalFooter.append(confirmDeleteButton);
//     modalContent.append(modalFooter);

//     modalDialog.append(modalContent);
//     modalFade.append(modalDialog);

//     $(modalFade).modal("show");
//     // When the modal hides, call the remove method to remove the modal from the DOM
//     $(modalFade).on('hidden.bs.modal',() => {
//         $(modalFade).remove();
//     });
// }
// /**
//  * @name - editStudentModal
//  */
// function editStudentModal() {

//     let studentInfo = student_array[$(this).parent().parent().index()];

//     // Modal form
//     // Modal frame
//     let modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true'>");
//     let modalDialog = $("<div class='modal-dialog' role='document'>");
//     let modalContent = $("<div>").addClass("modal-content");
//     let modalHeader = $("<div>").addClass("modal-header");// .text("Modal Header");
//     let modalTitle = $("<div>").addClass("modal-title").text("Edit Student");
//     let closeModalButton = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>");
//     let closeModalButtonSymbol = $("<span aria-hidden='true'>").text("x");
//     closeModalButton.append(closeModalButtonSymbol);

//     modalHeader.append(modalTitle);
//     modalHeader.append(closeModalButton);
//     modalContent.append(modalHeader);

//     let modalBody = $("<form>").addClass("modal-body");

//     // Student name input field
//     let modalBodyContentStudent= $("<div class='form-group' id='editNameDiv'>");
//     let modalBodyContentStudentNameLabel = $("<label for='Student Name' class='form-control-label'>").text("Student Name");
//     let modalBodyContentStudentName = $("<input type='text' id='name' class='form-control' onChange='nameValidation()'>").text(studentInfo.name);
//     modalBodyContentStudentName.val(studentInfo.name);
//     modalBodyContentStudent.append(modalBodyContentStudentNameLabel);
//     modalBodyContentStudent.append(modalBodyContentStudentName);

//     // Student Course input field
//     let modalBodyContentCourse= $("<div class='form-group' id='courseNameDiv'>"); // Create form group
//     let modalBodyContentCourseNameLabel = $("<label for='Course name' class='form-control-label'>").text("Course Name"); // Label for course
//     let modalBodyContentCourseName = $("<input type='text' id='editCourse' class='form-control' onChange='courseNameValidation()'>");
//     modalBodyContentCourseName.val(studentInfo.course_name);
//     modalBodyContentCourse.append(modalBodyContentCourseNameLabel);
//     modalBodyContentCourse.append(modalBodyContentCourseName);

//     //Student Course Grade input field
//     let modalBodyContentGrade = $("<div class='form-group' id='scoreDiv'>");
//     let modalBodyContentGradeLabel = $("<label for='Course grade' class='form-control-label'>").text("Course Grade");
//     let modalBodyContentGradeValue = $("<input type='text' id='editScore' class='form-control' onChange='gradeValidation()'>");
//     modalBodyContentGradeValue.val(studentInfo.grade);
//     modalBodyContentGrade.append(modalBodyContentGradeLabel);
//     modalBodyContentGrade.append(modalBodyContentGradeValue);

//     modalBody.append(modalBodyContentStudent);
//     modalBody.append(modalBodyContentCourse);
//     modalBody.append(modalBodyContentGrade);
//     modalContent.append(modalBody);

//     let modalFooter = $("<div>").addClass("modal-footer");
//     let cancelEditButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
//     cancelEditButton.text("Cancel");

//     let confirmEditButton = $("<button  class='btn btn-primary' data-dismiss='modal'>");


//     confirmEditButton.on("click", () => {
//         editStudent(studentInfo);
//     }); // Anonymous function to avoid firing as soon as modal loads
//     confirmEditButton.text("Confirm Edit");
//     modalFooter.append(cancelEditButton);
//     modalFooter.append(confirmEditButton);
//     modalContent.append(modalFooter);

//     modalDialog.append(modalContent);
//     modalFade.append(modalDialog);

//     $(modalFade).modal("show");
//     // When the modal hides, call the remove method to remove the modal from the DOM which clears the form after use
//     $(modalFade).on('hidden.bs.modal',() => {
//        $(modalFade).remove();
//         $("#studentNameDiv, #studentCourseDiv, #studentGradeDiv").removeClass("has-success");
//     });
// }

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

// /**
// * @name - editStudent - Use information from the modal to send info to the server
// * @param studentObj
//  */
// function editStudent(studentObj) {
//     // studentObj === studentInfo, contains id of student
//     let updatedInfo = {
//         id: studentObj.id,
//         student: $("#name").val(),
//         course: $("#editCourse").val(),
//         score: $("#editScore").val()
//     };
//     if (updatedInfo.student === '' && updatedInfo.course === '' && updatedInfo.score === '') {
//         $("#editNameDiv").addClass('has-warning');
//         $("#courseNameDiv").addClass('has-warning');
//         $("#scoreDiv").addClass('has-warning');

//     }
//     if (updatedInfo.student !== '' && updatedInfo.course !== '' && updatedInfo.score !== '') {
//         if ((updatedInfo.student.length > 2 && !parseInt(updatedInfo.student)) && (updatedInfo.course.length > 0 && updatedInfo.course.length <= 20) && (parseInt(updatedInfo.score) >= 0 && parseInt(updatedInfo.score) <= 100)) {
//             editDataOnServer(updatedInfo);
//         }
//     }

// }
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

function writeDataToServer(student) {
    let pendingAlert = $("<div class='alert alert-warning' style='text-align: center'>").append('<strong>Adding student</strong>');
    $("body").append(pendingAlert);
    // studentObj contains name, course, and grade
    $.ajax({
        data: student,
        dataType: "json",
        method: "POST",
        url: "data.php?action=insert",
        success: function(response) {
            $('.alert').remove(); // Remove the alert regardless of success or failure
            if (response.success === true) {
                student.id = response.insertID; // give the student an ID
                getDataFromServer(); // after inserting a student, make a call to the server to get the student list
            }
        },
        error: function(response) {
            $('.alert').remove(); // Remove the alert regardless of success or failure
            serverErrorModal(["uh oh"]); // In case of error, show a generic something was wrong modal
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
        success: completeRequest,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error creating post: ', textStatus, ', Details: ', errorThrown);
            console.error('Response: ', jqXHR.responseText);
            alert('An error occurred when creating your post:\n' + jqXHR.responseText);
        }
    });
}

function completeRequest(result) {
    console.log('Response received from API: ', result);
    $('.alert').remove(); // Remove the submitting alert.
    // Assume result.data is *JUST* the posts for a given dealership 
    if (result.data) {
        var sortedPosts = sortPostsByGroupAndDealership(result.data); // Pull the unique groups from the messages
        console.log("sortedPosts", sortedPosts);
        var groups = Object.keys(sortedPosts);
        for (var i = 0; i < groups.length; i++) {
            appendGroupToPage(groups[i]);
            var dealerships = Object.keys(sortedPosts[groups[i]]);
            for (var j = 0; j < dealerships.length; j++) {
                appendDealershipToGroup(dealerships[j], groups[i]); 
                var dealershipPosts = sortedPosts[groups[i]][dealerships[j]]["posts"];
                appendPostsToPage(dealershipPosts); // append the posts to the page
            }

        }
        return;
    }
    // result.message implies the 
    if (result.message) {
        result.data = [];
        result.data.push(result.message);
        // updateData(result.data);
        
        getDataFromServer(); 
    } else {
        result.errors = [];
        serverErrorModal(result.errors); // response.data is an array of objects)
    }

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
    $('.container')[0].appendChild(groupRow[0]);
    return;
}

function appendDealershipToGroup(dealershipName, groupName) {
    var dealershipRow = $("<div>").addClass("row");
    var groupId = trimWhiteSpaceAndConvertSpaceToDash(groupName);
    var dealershipId = trimWhiteSpaceAndConvertSpaceToDash(dealershipName);
    dealershipRow.attr({'id': dealershipId});
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


// Need to structure returned data into:
// groups = [dealership1, dealership2]
// dealership1 = [{PostId, Post, Replies}]


// Really the idea is that the whole thing should be "threads" with the initial post being the initial post 
// but it seems kind of silly given the implementation only has one person able to reply 

function appendPostsToPage(postNodes) {
    for (var i = 0; i < postNodes.length; i++) {
        if (postNodes[i].replies && postNodes[i].replies.length !== 0) {
            var postsList = $("<ul>"); // Only make the list for the top level element
            postsList.attr({'id': postNodes[i]["PostId"]}); // the first child will bring their parent into the DOM
            var postsListHeader = $("<h3>");
            postsListHeader.text(postNodes[i]["Post"].title);
            postsList.appendChild(bookmarksListHeader);
            $("body")[0].appendChild(postsList);
            appendPostsToPage(postNodes[i].replies);
        } else {
            var postsList = appendPostToList(postNodes[i]); 
        }
    }

}

function appendPostToList(postNode) {

    if (!postNode.replies) {
        // A postNode with no replies does not need to be recursively passed over
        var post = buildPostItem(postNode);
        var groupId = trimWhiteSpaceAndConvertSpaceToDash(postNode["Post"]["group"]);
        var dealershipId = trimWhiteSpaceAndConvertSpaceToDash(postNode["Post"]["dealership"]);
        var postSection = $("<ul>"); 
        postSection.attr({
            "id": postNode["PostId"],
            "class": "postSection"
        });
        postSection[0].appendChild(post[0]);
        $(`#${groupId} > #${dealershipId}`)[0].appendChild(postSection[0]);
    } else {
        console.log('appendPostToList: postNode', postNode);
        var postSection = $("<ul>"); 
        postSection.attr({
            "id": postNode["PostId"],
            "class": "postSection"
        });
        var postsListHeader = $("<h4>"); 
        postsListHeader.text(postNode.title);
        postSection[0].appendChild(postsListHeader[0]);
        $("body")[0].appendChild(postSection[0]);
    }
}


function buildPostItem(postNode) {
    var postListItem = $("<li>"); 
    postListItem.attr({
        "id": postNode["PostId"],
        "class": "postItem"
    });
    var postTitle = $("<h3>"); // Create post title
    postTitle.attr({
        "textContent": postNode["Post"].title,
        "class": "postTitle"
    });
    
    var postBody = $("<span class='postBody'>");
    var postBodyText = $("<p>").text(postNode["Post"].body);
    postBody[0].appendChild(postBodyText[0]);
    postTitle[0].appendChild(postBody[0]);
    postListItem[0].appendChild(postTitle[0]); // <li><h3></h3><span><p></p></span></li>

    return postListItem;
}


// [{PostId:<String>, Post: {title: String, body: String, dealership: String, group: String}}]
$(document).ready(function(){
    $('#submitComment').click(addClicked);
    $('#getDataFromServer').click(getDataFromServer);
});

}(jQuery));


