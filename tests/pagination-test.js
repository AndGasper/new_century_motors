// Okay not true test suite but I don't want to have to debug on the server

var postsEven = [1,2, 3, 4];
var postsOdd = [1,2, 3, 4, 5, 6, 7];
var postsMultipleOf3 = [1,2, 3, 4, 5, 6, 7, 8, 9];

var postsPerPage = 3;
var postsEvenLength = postsEven.length;
var postsOddLength = postsOdd.length;
var postsMultipleOf3Length = postsMultipleOf3.length;
var totalEvenPages = calculateTotalNumberOfPagesPerDealership(postsEvenLength, postsPerPage);
var totalOddPages = calculateTotalNumberOfPagesPerDealership(postsOddLength, postsPerPage);
var totalpostsMultipleOf3Pages = calculateTotalNumberOfPagesPerDealership(postsMultipleOf3Length, postsPerPage);
var pages = paginatePosts(postsEven, postsPerPage, totalEvenPages);
var pagesOddPosts = paginatePosts(postsOdd, postsPerPage, totalOddPages);
var pagesMultipleOf3 = paginatePosts(postsMultipleOf3, postsPerPage, totalpostsMultipleOf3Pages);
// pages output
// {
//     page1: [1, 2, 3],
//     page2: [4]
// }
// pagesOdd output 
// {
//     page1: [1, 2, 3],
//     page2: [4, 5, 6], 
//     page3: [7]
// }

// pagesMultipleOf3 output
// {
//     page1: [1, 2, 3],
//     page2: [4, 5, 6],
//     page3: [7, 8, 9]
// }


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

function paginatePosts(posts, postsPerPage, totalPages) {
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

