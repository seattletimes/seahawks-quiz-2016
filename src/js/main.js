require("./lib/social");
require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("jquery");
var ich = require("icanhaz");
var questionTemplate = require("./_questionTemplate.html");
var resultTemplate = require("./_resultTemplate.html");

var scores = {};
var questionIndex;
var id = 1;

// Set up templates
ich.addTemplate("questionTemplate", questionTemplate);
ich.addTemplate("resultTemplate", resultTemplate);

var Share = require("share");
new Share(".share-button", {
  description: "Which Seahawk are YOU? Take our personality quiz and find out.",
  ui: {
    flyout: "bottom left"
  },
  networks: {
    email: {
      description: "Which Seahawk are YOU? Take our personality quiz and find out. " + window.location.href
    }
  }
});
new Share(".share-bottom", {
  description: "Which Seahawk are YOU? Take our personality quiz and find out.",
  ui: {
    flyout: "top left"
  },
  networks: {
    email: {
      description: "Which Seahawk are YOU? Take our personality quiz and find out. " + window.location.href
    }
  }
});

var quizLength = Object.keys(quizData).length;

var showQuestion = function(questionId) {
  $(".index").html(id + " of " + quizLength);
  $(".question-box").html(ich.questionTemplate(quizData[id]));
};


// show next button when answer is selected
$(".quiz-box").on("click", "input", (function(){
  $(".next").addClass("active");
  $(".next").attr("disabled", false);
}));

$(".next").click(function() {
  // score answer
  var playerPoints = $("input:checked").val().split(" ");
  playerPoints.forEach(function(point) {
    if (point === "") return;
    if (!scores[point]) { scores[point] = 0 }
    scores[point] += 1;
  });

  // move on to next question
  if (id < quizLength) {
    id += 1;
    showQuestion(id);
    $(".next").removeClass("active");
    $(".next").attr("disabled", true);
    // Change button text on last question
    if (id == quizLength) {
      $(".next").html("FINISH");
    }
  } else {
    calculateResult();
  }
});


var calculateResult = function() {
  // find highest match(es)
  var highestScore = 0;
  for (var player in scores) {
    if (scores[player] >= highestScore) {
      highestScore = scores[player];
    }
  }

  //loop again to find ties
  var highestPlayers = [];
  for (var player in scores) {
    if (scores[player] == highestScore) {
      highestPlayers.push(player);
    }
  }

  var random = Math.round(Math.random() * (highestPlayers.length - 1));
  var resultId = highestPlayers[random];
  var result;
  playerData.forEach(function(player) {
    if (player.playerid != resultId) return;
    result = player;
  });

  // display result
  $(".quiz-box").html(ich.resultTemplate(result));
  $(".retake").removeClass("hidden");
  $(".quiz-container").addClass("results");
  new Share(".share-button", {
    description: "I got " + result.player + "! Which Seahawk are YOU?",
    ui: {
      flyout: "bottom left",
      button_text: "SHARE RESULTS"
    },
    url: window.location.href + result.name + ".html",
    networks: {
      email: {
        description: "I got " + result.player + "! Which Seahawk are YOU? " + window.location.href
      }
    }
  });
  $(".share-button").addClass("share-results");
};

showQuestion(questionIndex);
