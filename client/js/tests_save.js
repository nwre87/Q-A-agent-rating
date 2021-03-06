var saveResult = function (testId, category, subcategory, sub_cat_hash) {
  objectToInsert = {};
  objectToInsert[category] = {};
  objectToInsert[category][subcategory] = sub_cat_hash;
  insertionTarget = "categories." + category + "." + subcategory;
  var setHash = { $set: {} };
  setHash.$set[insertionTarget] = sub_cat_hash;
  console.log("this is setHash:");
  console.log(setHash);
  Meteor.call('updateTest', testId, setHash);
}

var parseIntFormSubmission = function(formContent, subcategory){
  // result object is straight from the form - all strings, no integers
  var result = formContent[subcategory];
  var newResults = [];
  for(var i = 0; i < result.length ; i++){
    newResults[i] = {};
    if (result[i].score){
      newResults[i].score = parseInt(result[i].score);
      newResults[i].maxScore = parseInt(result[i].maxScore);
      console.log('score');
      console.log(newResults[i].score);
      console.log(newResults[i].maxScore);
    } else {
      newResults[i].maxScore = parseInt(result[i].maxScore);
      console.log('score');
      console.log(newResults[i].score);
    };
  };

  return newResults;
}

processForm = function(testId, formName, category) {

  var selector = 'form[name=\"'+formName+'\"]';
  console.log("selector:");
  console.log(selector);
  var formSubmission = $(selector).serializeObject();
  console.log("form from serializeObject");
  console.log(formSubmission);

  var subcategory = Object.keys(formSubmission)[0];
  var formSubmissionWithIntegers = parseIntFormSubmission(formSubmission, subcategory);
  var subCatResult = calcSubCatResult(formSubmissionWithIntegers);
  var sub_cat_hash = {};
  sub_cat_hash.test = formSubmissionWithIntegers;
  sub_cat_hash.sub_cat_result = subCatResult;
  saveResult(testId, category, subcategory, sub_cat_hash);
}


calcSubCatResult = function(result) {
  console.log("This is the result param for calcSubCatResult:");
  console.log(result);
  var totalScore = 0;
  var totalMaxScore = 0;
  for(var i = 0; i < result.length; i++){
    score = result[i].score;
    maxScore = result[i].maxScore;

    if (!!result[i].score){
      totalScore += score;
      totalMaxScore += maxScore;
    };
  }
  var subCatResult = {};
  subCatResult.total_score = totalScore;
  subCatResult.max_score = totalMaxScore;
  return subCatResult;
}
