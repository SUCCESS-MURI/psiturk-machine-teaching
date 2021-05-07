/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */


    // Initalize psiturk object
    var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

    function split_joint_counterbalance(joint_counterbalance) {
        var train_test_set = 0;

        if (joint_counterbalance <= 5) {
            train_test_set = 0;
            counterbalance = joint_counterbalance;
        }
        else if (joint_counterbalance >= 12) {
            train_test_set = 2;
            counterbalance = joint_counterbalance - 12;
        }
        else {
            train_test_set = 1;
            counterbalance = joint_counterbalance - 6;
        }

        return [counterbalance, train_test_set]
    }

    // condition will determine the condition, counterbalance will determine domain order, number of data points will determine which train/test set you get

    // a) manually assign from remaining conditions
    // var remaining_joint_conditions = [[0, 0, 0], [0, 0, 1], [0, 0, 2], [0, 1, 0], [0, 1, 1], [0, 1, 2], [0, 2, 0], [0, 2, 1], [0, 2, 2], [0, 3, 0], [0, 3, 1], [0, 3, 2], [0, 4, 0], [0, 4, 1], [0, 4, 2], [0, 5, 0], [0, 5, 1], [0, 5, 2], [1, 0, 0], [1, 0, 1], [1, 0, 2], [1, 1, 0], [1, 1, 1], [1, 1, 2], [1, 2, 0], [1, 2, 1], [1, 2, 2], [1, 3, 0], [1, 3, 1], [1, 3, 2], [1, 4, 0], [1, 4, 1], [1, 4, 2], [1, 5, 0], [1, 5, 1], [1, 5, 2], [2, 0, 0], [2, 0, 1], [2, 0, 2], [2, 1, 0], [2, 1, 1], [2, 1, 2], [2, 2, 0], [2, 2, 1], [2, 2, 2], [2, 3, 0], [2, 3, 1], [2, 3, 2], [2, 4, 0], [2, 4, 1], [2, 4, 2], [2, 5, 0], [2, 5, 1], [2, 5, 2], [3, 0, 0], [3, 0, 1], [3, 0, 2], [3, 1, 0], [3, 1, 1], [3, 1, 2], [3, 2, 0], [3, 2, 1], [3, 2, 2], [3, 3, 0], [3, 3, 1], [3, 3, 2], [3, 4, 0], [3, 4, 1], [3, 4, 2], [3, 5, 0], [3, 5, 1], [3, 5, 2], [4, 0, 0], [4, 0, 1], [4, 0, 2], [4, 1, 0], [4, 1, 1], [4, 1, 2], [4, 2, 0], [4, 2, 1], [4, 2, 2], [4, 3, 0], [4, 3, 1], [4, 3, 2], [4, 4, 0], [4, 4, 1], [4, 4, 2], [4, 5, 0], [4, 5, 1], [4, 5, 2], [5, 0, 0], [5, 0, 1], [5, 0, 2], [5, 1, 0], [5, 1, 1], [5, 1, 2], [5, 2, 0], [5, 2, 1], [5, 2, 2], [5, 3, 0], [5, 3, 1], [5, 3, 2], [5, 4, 0], [5, 4, 1], [5, 4, 2], [5, 5, 0], [5, 5, 1], [5, 5, 2], [6, 0, 0], [6, 0, 1], [6, 0, 2], [6, 1, 0], [6, 1, 1], [6, 1, 2], [6, 2, 0], [6, 2, 1], [6, 2, 2], [6, 3, 0], [6, 3, 1], [6, 3, 2], [6, 4, 0], [6, 4, 1], [6, 4, 2], [6, 5, 0], [6, 5, 1], [6, 5, 2], [7, 0, 0], [7, 0, 1], [7, 0, 2], [7, 1, 0], [7, 1, 1], [7, 1, 2], [7, 2, 0], [7, 2, 1], [7, 2, 2], [7, 3, 0], [7, 3, 1], [7, 3, 2], [7, 4, 0], [7, 4, 1], [7, 4, 2], [7, 5, 0], [7, 5, 1], [7, 5, 2], [8, 0, 0], [8, 0, 1], [8, 0, 2], [8, 1, 0], [8, 1, 1], [8, 1, 2], [8, 2, 0], [8, 2, 1], [8, 2, 2], [8, 3, 0], [8, 3, 1], [8, 3, 2], [8, 4, 0], [8, 4, 1], [8, 4, 2], [8, 5, 0], [8, 5, 1], [8, 5, 2]];
    // var joint_condition = remaining_joint_conditions[Math.floor(Math.random() * remaining_joint_conditions.length)];
    // condition = joint_condition[0];
    // counterbalance = joint_condition[1];
    // var train_test_set = joint_condition[2];

    // b) rely on PsiTurk's counterbalancing
    var split_counterbalance = split_joint_counterbalance(counterbalance);
    counterbalance = split_counterbalance[0];
    var train_test_set = split_counterbalance[1];

    console.log(condition);
    console.log(counterbalance);
    console.log(train_test_set);

    // Headers
    var training_video_header = "<h1>Demonstration of optimal strategy</h1> <hr/>" + "<h4>Feel free to watch the video as many times as you want (but at least once)!</h4> ";
    var testing_simulation_header = "<h1>Participant gameplay</h1> <hr/>" + "<h3>Now it's your turn to play! Please demonstrate how you would maximize your score in this game configuration.</h3> " +
        "You <b>may reset</b> at any time <b>before the game ends</b> if think you've made a mistake.<br> <h3>Please answer the question below <b>after</b> providing your demonstration.</h3>" ;

    var sandbox_2_header = "<h1>Free play</h1> <hr/> " +
        "<h4>A subset of the following keys will be available to control Chip in each game:</h4>" +
        "<table class=\"center\"><tr><th>Key</th><th>Action</th></tr><tr><td>up/down/left/right arrow keys</td><td>corresponding movement</td></tr><tr><td>p</td><td>pick up</td></tr><tr><td>d</td><td>drop</td></tr><tr><td>e</td><td>exit</td></tr><tr><td>r</td><td>reset simulation</td></tr></table><br>" +
                "<h3>Feel free to play around in the game below and get used to the controls. </h3> <h4>You can click the continue button whenever you feel ready to move on.</h4>";


    var sandbox_3_header = "<h1>Scoring</h1> <hr/> " + "<h3>Since this is practice, we will reveal each event's scoring and also provide a running counter of Chip's current score. </h3> <br>" +
        "<table class=\"center\"><tr><th>Event</th><th>Sample sequence</th><th>Scoring</th></tr><tr><td>Dropping off the green pentagon at the purple star</td><td><img src = 'static/img/sandbox_dropoff1.png' width=\"75\" height=auto /><img src = 'static/img/arrow.png' width=\"30\" height=auto /><img src = 'static/img/sandbox_dropoff2.png' width=\"75\" height=auto /></td><td>+15</td></tr><tr><td>Any action that you take (e.g. moving right), except exiting </td><td><img src = 'static/img/right1.png' width=\"150\" height=auto /><img src = 'static/img/arrow.png' width=\"30\" height=auto /><img src = 'static/img/right2.png' width=\"150\" height=auto /><td>-1</td></tr></table> <br>" +
        "<h3><b>Pick up the green pentagon</b> and <b>drop it off at the purple star</b> using the <b>fewest number of actions </b>(the optimal strategy for this game configuration). </h3> " +
        "<h4>You should end with a higher score (16) than your initial score (15). <u>You will have 3 chances to get it right!</u></h4>";


    var sandbox_4_header = "<h1>Negative-biased configurations</h1> <hr/> " + "<h3>You will sometimes <b>encounter a configuration </b> of the game where <b>negative events will outweigh the positive events</b>.</h3> <h3>Thus, <b>working toward the positive events</b> like before will actually leave you with a <u>lower score</u> (12) than what your initial score (15).</h3><br>" +
        "<h3><u>To see why this is a poor strategy</u>, <b>pick up the green pentagon</b> and <b>drop it off at the purple star</b> again using the fewest number of actions.</h3> <p>You will have 3 chances to get it right!</p>";

    var sandbox_5_header = "<h1>Learning to exit</h1> <hr/> " + "<h3>In these <b>negatively-biased configurations</b>, the <b>optimal strategy is to exit right away</b> instead and <b>maintain your initial score</b> (15).</h3> <h3>Click on the game below and <span style='color:red'>press 'e' to exit right away.</span></h3><p>You will have 3 chances to get it right!</p>";

    // -- Surveys
    var interim_header = "You have viewed all of the demonstrations for this game! Please complete the survey below.";
    var post_study_header = "<h2>Congratulations on getting through all of the main games!</h2><br>Please answer the following questions, and then click ‘Continue’ for a closing debrief on the study and instructions on compensation.";

    var training_informativeness_prompt = "How informative were these demonstrations in understanding how to score well in this game?";
    var training_mental_effort_prompt = "How much mental effort was required to process these demonstrations?";
    var training_puzzlement_prompt = "How puzzled were you by these demonstrations?";
    var testing_difficulty_prompt = "How confident are you that you obtained the optimal score?";

    // INSTRUCTIONS
    var instructions_intro = {
        type:'external-html',
        url: "instructions/intro.html",
        question_type: "study_introduction",
        cont_btn: "next",
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set
    };

    var instructions_overview = {
        type:'external-html',
        url: "instructions/overview.html",
        question_type: "overview",
        cont_btn: "next",
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set
    };

    var sandbox_introduction = {
        type:'external-html',
        url: "instructions/sandbox_introduction.html",
        question_type: "sandbox_introduction",
        cont_btn: "next",
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set
    };

    var augmented_taxi_introduction = {
        type:'external-html',
        url: "instructions/augmented_taxi_introduction.html",
        question_type: "augmented_taxi_introduction",
        cont_btn: "next",
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set
    };

    var two_goal_introduction = {
        type:'external-html',
        url: "instructions/two_goal_introduction.html",
        question_type: "two_goal_introduction",
        cont_btn: "next",
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set
    };

    var skateboard_introduction = {
        type:'external-html',
        url: "instructions/skateboard_introduction.html",
        question_type: "skateboard_introduction",
        cont_btn: "next",
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set
    };

    var post_practice_button = {
        type: "html-button-response",
        stimulus: "<h3>Good job on completing the practice games! Let's head over to the three main games now and <b>begin the real study</b>.</h3><br>" +
            "<h3><b>Each main game</b> will have a <b>different scoring system and optimal strategy</b> that you will now have to <u>figure out through observing Chip's demonstrations!</u></h3><br>",
        question_type: "post_practice_stage",
        choices: ["Continue"],
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set
    };

    var post_main_game_button = {
        type: "html-button-response",
        stimulus: "<h3>You've completed all of the gameplays for this game. Let's head over to the next one!</h3><br>",
        question_type: "post_main_game",
        choices: ["Continue"],
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set
    };


    // Miscellaneous pages
    var debrief = {
        type:'external-html',
        url: "debrief.html",
        question_type: 'debrief',
        execute_script: true,
        force_refresh: true,
        cont_btn: "next",
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set
    };



    //LIKERT SCALES
    var training_informativeness_scale = [
        "Not Informative",
        "Slightly Informative",
        "Moderately Informative",
        "Very Informative",
        "Extremely Informative"
    ];
    var training_mental_effort_scale = [
        "No Effort",
        "Slight Effort",
        "Moderate Effort",
        "Significant Effort",
        "Extreme Effort"
    ];
    var training_puzzlement_scale = [
        "Not Puzzled",
        "Slightly Puzzled",
        "Moderately Puzzled",
        "Very Puzzled",
        "Extremely Puzzled"
    ];
    var testing_difficulty_scale = [
        "Not Confident",
        "Slightly Confident",
        "Somewhat Confident",
        "Very Confident",
        "Extremely Confident",
    ];

    var sandbox_1_parameters = {
        'agent': {'x': 4, 'y': 1, 'has_passenger': 0},
        'walls': [{'x': 1, 'y': 3}, {'x': 2, 'y': 3}, {'x': 3, 'y': 3}],
        'passengers': [{'x': 1, 'y': 2, 'dest_x': 1, 'dest_y': 4, 'in_taxi': 0}],
        'width': 4,
        'height': 4,
    };

    var sandbox_2_parameters = {
        'agent': {'x': 4, 'y': 3, 'has_passenger': 0},
        'walls': [{'x': 2, 'y': 3}, {'x': 2, 'y': 2}, {'x': 3, 'y': 2}, {'x': 4, 'y': 2}],
        'passengers': [{'x': 4, 'y': 1, 'dest_x': 1, 'dest_y': 4, 'in_taxi': 0}],
        'width': 4,
        'height': 4,
    };


var post_study_survey = {
    type: 'survey-text',
    preamble: post_study_header,
    questions: [
        {
            prompt: "Do you have any comments or feedback on the study?",
            qtype: "text",
            placeholder: "Your answer here...",
            rows: 5
        },
        {
            prompt: "What is your age?",
            qtype: "number",
            placeholder: "Your answer here...",
            required: true,
            rows: 1
        },
        {
            prompt: "Which of the following most accurately describes you?",
            qtype: "multi",
            options: ["Male", "Female", "Non-binary", "Prefer not to disclose"],
            required: true,
        },
    ],
    force_refresh: true,
    execute_script: true,
    question_type: 'post_study_survey',
    condition: condition,
    counterbalance: counterbalance,
    train_test_set: train_test_set
};

function testing_simulation(source, mdp_parameters, domain, preamble, continue_condition = null) {
    if (domain == 'two_goal'){
        key_table = "<br><br><br><table class=\"center\"><tr><th>Key</th><th>Action</th></tr><tr><td>up/down/left/right arrow keys</td><td>corresponding movement</td></tr><tr><td>e</td><td>exit</td></tr><tr><td>r</td><td>reset simulation</td></tr></table><br>";
    } else {
        key_table = "<br><br><br><table class=\"center\"><tr><th>Key</th><th>Action</th></tr><tr><td>up/down/left/right arrow keys</td><td>corresponding movement</td></tr><tr><td>p</td><td>pick up</td></tr><tr><td>d</td><td>drop</td></tr><tr><td>e</td><td>exit</td></tr><tr><td>r</td><td>reset simulation</td></tr></table><br>";
    }


    if (domain == 'sandbox') {
        stimulus = '<iframe id = "ifrm" style="border:none;" src="' + source + '" height="550" width="950" title="Iframe Example"></iframe>    ';
        questions = []
    }
    else if (domain == 'augmented_taxi') {
        stimulus = '<iframe id = "ifrm" style="border:none;" src="' + source + '" height="550" width="750" title="Iframe Example"></iframe>    '
        questions = [{prompt: testing_difficulty_prompt, labels: testing_difficulty_scale, required: true }]
    } else if (domain == 'two_goal') {
        stimulus = '<iframe id = "ifrm" style="border:none;" src="' + source + '" height="700" width="700" title="Iframe Example"></iframe>    '
        questions = [{prompt: testing_difficulty_prompt, labels: testing_difficulty_scale, required: true }]
    }
    else {
        stimulus = '<iframe id = "ifrm" style="border:none;" src="' + source + '" height="600" width="800" title="Iframe Example"></iframe>    '
        questions = [{prompt: testing_difficulty_prompt, labels: testing_difficulty_scale, required: true }]
    }

    if (domain == 'sandbox' && continue_condition == 'free_play') {
        legend = null;
    } else {
        legend = key_table;
    }

    var ret = {
        // Webpage information
        type: 'sim-likert',
        preamble: preamble,
        legend: legend,
        iframe_id: "ifrm",
        stimulus: stimulus,
        questions: questions,

        // Training information
        training_traj_length: {},

        // Testing information
        mdp_parameters: mdp_parameters,

        // Study information
        domain: domain,
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set,
        interaction_type: 'testing_simulation',
        question_type: 'interaction',

        // for sandbox domain
        continue_condition: continue_condition
    };
    return ret;
}

function training_video(primary_video, domain, training_traj_length, preamble = training_video_header) {
    if (domain == 'augmented_taxi') {
        stimulus = '<video controls width="704" height="526" id="stimulus" src="' + primary_video + '"type="video/mp4" > </video>  '
    } else if (domain == 'two_goal') {
        stimulus = '<video controls width="526" height="526" id="stimulus" src="' + primary_video + '"type="video/mp4" > </video>  '
    }
    else {
        stimulus = '<video controls width="930" height="526" id="stimulus" src="' + primary_video + '"type="video/mp4" > </video>  '
    }

    var ret = {
        // Webpage information
        type: 'sim-likert',
        preamble: preamble,
        stimulus: stimulus,
        questions: [],

        // Training information
        training_traj_length: training_traj_length,

        // Testing information
        mdp_parameters: {},

        // Study information
        domain: domain,
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set,
        interaction_type: 'training_video',
        question_type: 'interaction',
    };

    return ret;
}

function training_survey(domain) {
    var survey = {
        type: 'survey-likert',
        preamble: interim_header,
        questions: [
            {prompt: training_informativeness_prompt, labels: training_informativeness_scale, required: true },
            {prompt: training_mental_effort_prompt, labels: training_mental_effort_scale, required: true },
            {prompt: training_puzzlement_prompt, labels: training_puzzlement_scale, required: true },
        ],
        freeform:
            [{
                prompt: "Feel free to explain any of your selections above if you wish:",
                qtype: "text",
                placeholder: "Your answer here...",
                rows: 5,
                columns: 40
          }],
        question_type: 'interim_survey',
        randomize_question_order: false,
        domain: domain,
        condition: condition,
        counterbalance: counterbalance,
        train_test_set: train_test_set
    };
    return survey
}

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    var augmented_taxi_training = [], two_goal_training = [], skateboard_training = [];
    var augmented_taxi_testing = [], two_goal_testing = [], skateboard_testing = [];

    /* 3 sets of training and testing demos were randomly selected to ensure that no one uncharacteristic selection
     could heavily affect the results. Change based on how many participants have been recorded thus far to ensure
      uniform distribution. */

    var training_mapping;
    if (train_test_set == 0) {
        training_mapping = 'a';
    } else if (train_test_set == 1) {
        training_mapping = 'b';
    } else {
        training_mapping = 'c';
    }

    training_traj_lengths = {"two_goal": {"k7_k8_k2": {"3": 9, "1c": 2, "2b": 6, "1a": 2, "1b": 2, "2a": 5, "5": 1, "4": 6, "2c": 6}, "k4_k5": {"3": 6, "1c": 2, "2b": 6, "1a": 2, "1b": 2, "2a": 6, "5": 1, "4": 4, "2c": 6}, "k3": {"3": 6, "1c": 10, "2b": 9, "1a": 10, "1b": 9, "2a": 10, "5": 1, "4": 4, "2c": 9}, "k1": {"3b": 4, "2b": 6, "1a": 5, "2a": 5, "1b": 6, "1c": 6, "3c": 4, "2c": 6, "3a": 3}, "k6": {"3": 9, "1c": 9, "2b": 9, "1a": 7, "1b": 7, "2a": 9, "5": 1, "4": 6, "2c": 7}, "k0": {"3b": 1, "2b": 2, "1a": 2, "2a": 2, "1b": 1, "1c": 2, "3c": 2, "2c": 1, "3a": 2}}, "skateboard": {"k7_k8_k2": {"3c": 18, "3b": 14, "2b": 7, "1a": 3, "1b": 3, "2a": 8, "1c": 3, "5": 9, "4": 1, "2c": 7, "3a": 13}, "k4_k5": {"3c": 11, "3b": 14, "2b": 7, "1a": 3, "1b": 3, "2a": 9, "1c": 3, "5": 1, "4": 9, "2c": 7, "3a": 6}, "k3": {"3c": 9, "3b": 15, "2b": 13, "1a": 9, "1b": 13, "2a": 11, "1c": 9, "5": 1, "4": 9, "2c": 10, "3a": 9}, "k1": {"1c": 2, "2b": 8, "1a": 1, "2a": 9, "1b": 2, "2c": 8}, "k6": {"3c": 15, "3b": 12, "2b": 17, "1a": 10, "1b": 12, "2a": 15, "1c": 15, "5": 9, "4": 1, "2c": 5, "3a": 7}, "k0": {"1c": 1, "2b": 1, "1a": 2, "2a": 1, "1b": 3, "2c": 3}}, "augmented_taxi": {"k7_k8_k2": {"3c": 14, "3b": 9, "2b": 12, "1a": 12, "1b": 11, "2a": 14, "1c": 6, "5": 12, "4": 1, "2c": 8, "3a": 14}, "k4_k5": {"3c": 7, "3b": 14, "2b": 6, "1a": 4, "1b": 4, "2a": 11, "1c": 5, "5": 1, "4": 12, "2c": 7, "3a": 6}, "k3": {"3c": 8, "3b": 7, "2b": 7, "1a": 8, "1b": 7, "2a": 8, "1c": 8, "5": 1, "4": 12, "2c": 8, "3a": 8}, "k1": {"1c": 9, "2b": 7, "1a": 7, "2a": 6, "1b": 11, "2c": 12}, "k6": {"3c": 9, "3b": 7, "2b": 12, "1a": 11, "1b": 8, "2a": 8, "1c": 11, "5": 12, "4": 1, "2c": 5, "3a": 12}, "k0": {"1c": 12, "2b": 6, "1a": 12, "2a": 6, "1b": 12, "2c": 6}}};

    switch (condition) {
        case 0:
            var folder = 'k0';

            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_1' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['1'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_2' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['2'+training_mapping]));

            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_1' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['1'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_2' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['2'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_3' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['3'+training_mapping]));

            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_1' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['1'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_2' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['2'+training_mapping]));
            break;
        case 1:
            var folder = 'k1';

            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_1' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['1'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_2' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['2'+training_mapping]));

            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_1' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['1'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_2' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['2'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_3' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['3'+training_mapping]));

            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_1' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['1'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_2' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['2'+training_mapping]));
            break;
        case 2:
            var folder = 'k7_k8_k2';

            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_4.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['4']));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_5.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['5']));

            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_3.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['3']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_4.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['4']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_5.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['5']));

            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_4.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['4']));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_5.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['5']));
            break;
        case 3:
            var folder = 'k3';

            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_1' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['1'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_2' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['2'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_3' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['3'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_4.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['4']));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_5.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['5']));

            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_1' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['1'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_2' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['2'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_3.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['3']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_4.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['4']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_5.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['5']));

            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_1' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['1'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_2' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['2'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_3' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['3'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_4.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['4']));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_5.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['5']));
            break;
        case 4:
            var folder = 'k4_k5';

            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_1' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['1'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_2' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['2'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_3' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['3'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_4.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['4']));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_5.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['5']));

            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_1' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['1'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_2' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['2'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_3.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['3']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_4.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['4']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_5.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['5']));

            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_1' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['1'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_2' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['2'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_3' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['3'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_4.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['4']));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_5.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['5']));
            break;
        case 5:
            var folder = 'k4_k5';

            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_5.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['5']));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_4.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['4']));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_3' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['3'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_2' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['2'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_1' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['1'+training_mapping]));

            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_5.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['5']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_4.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['4']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_3.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['3']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_2' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['2'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_1' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['1'+training_mapping]));

            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_5.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['5']));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_4.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['4']));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_3' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['3'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_2' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['2'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_1' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['1'+training_mapping]));
            break;
        case 6:
            var folder = 'k6';

            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_1' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['1'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_2' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['2'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_3' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['3'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_4.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['4']));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_5.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['5']));

            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_1' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['1'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_2' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['2'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_3.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['3']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_4.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['4']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_5.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['5']));

            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_1' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['1'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_2' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['2'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_3' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['3'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_4.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['4']));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_5.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['5']));
            break;
        case 7:
            var folder = 'k7_k8_k2';

            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_1' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['1'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_2' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['2'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_3' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['3'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_4.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['4']));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_5.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['5']));

            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_1' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['1'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_2' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['2'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_3.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['3']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_4.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['4']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_5.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['5']));

            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_1' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['1'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_2' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['2'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_3' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['3'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_4.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['4']));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_5.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['5']));
            break;
        case 8:
            var folder = 'k7_k8_k2';

            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_5.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['5']));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_4.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['4']));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_3' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['3'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_2' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['2'+training_mapping]));
            augmented_taxi_training.push(training_video('/static/vid/' + folder + '/taxi_1' + training_mapping + '.mp4', 'augmented_taxi', training_traj_lengths['augmented_taxi'][folder]['1'+training_mapping]));

            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_5.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['5']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_4.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['4']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_3.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['3']));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_2' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['2'+training_mapping]));
            two_goal_training.push(training_video('/static/vid/' + folder + '/tg_1' + training_mapping + '.mp4', 'two_goal', training_traj_lengths['two_goal'][folder]['1'+training_mapping]));

            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_5.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['5']));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_4.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['4']));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_3' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['3'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_2' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['2'+training_mapping]));
            skateboard_training.push(training_video('/static/vid/' + folder + '/skateboard_1' + training_mapping + '.mp4', 'skateboard', training_traj_lengths['skateboard'][folder]['1'+training_mapping]));
            break;
        default:
            console.error('Unexpected condition encountered.');
    }

    var testing_mdp_parameters = {"augmented_taxi": {"low": [[{"opt_traj_length": 6, "test_difficulty": "low", "passengers": [{"y": 2, "x": 2, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [0, 0, 0, 0, 1, 0, 0, 1], "height": 3, "tag": 0, "fuel_station": [], "agent": {"has_passenger": 0, "x": 1, "y": 1}, "tolls": [{"y": 2, "x": 3}, {"y": 1, "x": 3}], "opt_actions": ["right", "up", "pickup", "down", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.6666666666666667, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}, {"opt_traj_length": 5, "test_difficulty": "low", "passengers": [{"y": 2, "x": 2, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [0, 1, 1, 0, 0, 0, 0, 0], "height": 3, "tag": 2, "fuel_station": [], "agent": {"has_passenger": 0, "x": 2, "y": 3}, "tolls": [{"y": 3, "x": 3}, {"y": 3, "x": 4}], "opt_actions": ["down", "pickup", "down", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.7000000000000001, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}], [{"opt_traj_length": 5, "test_difficulty": "low", "passengers": [{"y": 2, "x": 2, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [0, 0, 0, 0, 1, 0, 0, 0], "height": 3, "tag": 1, "fuel_station": [], "agent": {"has_passenger": 0, "x": 2, "y": 3}, "tolls": [{"y": 2, "x": 3}], "opt_actions": ["down", "pickup", "down", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.7000000000000001, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}, {"opt_traj_length": 5, "test_difficulty": "low", "passengers": [{"y": 1, "x": 2, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [1, 1, 0, 0, 0, 0, 0, 0], "height": 3, "tag": 4, "fuel_station": [], "agent": {"has_passenger": 0, "x": 3, "y": 2}, "tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}], "opt_actions": ["down", "left", "pickup", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.7000000000000001, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}], [{"opt_traj_length": 4, "test_difficulty": "low", "passengers": [{"y": 1, "x": 2, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [0, 0, 0, 1, 1, 1, 0, 0], "height": 3, "tag": 3, "fuel_station": [], "agent": {"has_passenger": 0, "x": 3, "y": 1}, "tolls": [{"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}], "opt_actions": ["left", "pickup", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.7333333333333334, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}, {"opt_traj_length": 5, "test_difficulty": "low", "passengers": [{"y": 1, "x": 2, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [0, 1, 0, 0, 0, 0, 0, 0], "height": 3, "tag": 5, "fuel_station": [], "agent": {"has_passenger": 0, "x": 3, "y": 2}, "tolls": [{"y": 3, "x": 3}], "opt_actions": ["down", "left", "pickup", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.7000000000000001, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}]], "medium": [[{"opt_traj_length": 10, "test_difficulty": "medium", "passengers": [{"y": 1, "x": 4, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [1, 0, 0, 0, 0, 0, 0, 1], "height": 3, "tag": 0, "fuel_station": [], "agent": {"has_passenger": 0, "x": 2, "y": 2}, "tolls": [{"y": 3, "x": 2}, {"y": 1, "x": 3}], "opt_actions": ["right", "right", "down", "pickup", "up", "left", "left", "down", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.5333333333333334, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}, {"opt_traj_length": 7, "test_difficulty": "medium", "passengers": [{"y": 3, "x": 4, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [0, 1, 0, 0, 1, 1, 0, 1], "height": 3, "tag": 3, "fuel_station": [], "agent": {"has_passenger": 0, "x": 4, "y": 3}, "tolls": [{"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 3}], "opt_actions": ["pickup", "left", "left", "down", "down", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.5333333333333334, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}], [{"opt_traj_length": 11, "test_difficulty": "medium", "passengers": [{"y": 3, "x": 4, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [1, 0, 0, 0, 0, 1, 0, 0], "height": 3, "tag": 1, "fuel_station": [], "agent": {"has_passenger": 0, "x": 4, "y": 1}, "tolls": [{"y": 3, "x": 2}, {"y": 2, "x": 4}], "opt_actions": ["left", "up", "up", "right", "pickup", "left", "down", "down", "left", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.5, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}, {"opt_traj_length": 6, "test_difficulty": "medium", "passengers": [{"y": 2, "x": 2, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [0, 0, 1, 1, 0, 1, 0, 1], "height": 3, "tag": 4, "fuel_station": [], "agent": {"has_passenger": 0, "x": 4, "y": 2}, "tolls": [{"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 4}, {"y": 1, "x": 3}], "opt_actions": ["left", "left", "pickup", "down", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.5666666666666667, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}], [{"opt_traj_length": 9, "test_difficulty": "medium", "passengers": [{"y": 1, "x": 4, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [0, 0, 0, 1, 0, 1, 0, 0], "height": 3, "tag": 2, "fuel_station": [], "agent": {"has_passenger": 0, "x": 4, "y": 3}, "tolls": [{"y": 2, "x": 2}, {"y": 2, "x": 4}], "opt_actions": ["left", "down", "down", "right", "pickup", "left", "left", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.5666666666666667, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}, {"opt_traj_length": 12, "test_difficulty": "medium", "passengers": [{"y": 3, "x": 4, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "env_code": [0, 0, 0, 0, 1, 0, 0, 1], "height": 3, "tag": 5, "fuel_station": [], "agent": {"has_passenger": 0, "x": 1, "y": 1}, "tolls": [{"y": 2, "x": 3}, {"y": 1, "x": 3}], "opt_actions": ["right", "up", "up", "right", "right", "pickup", "left", "left", "down", "down", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "gamma": 1, "width": 4, "opt_traj_reward": 0.4666666666666667, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}]], "high": [[{"opt_traj_length": 8, "test_difficulty": "high", "passengers": [{"y": 3, "x": 3, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "height": 3, "tag": 0, "fuel_station": [], "agent": {"y": 2, "x": 2, "has_passenger": 0}, "tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}], "opt_actions": ["up", "right", "pickup", "down", "down", "left", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "env_code": [1, 1, 1, 1, 1, 1, 1, 1], "gamma": 1, "width": 4, "opt_traj_reward": 0.10000000000000003, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}, {"opt_traj_length": 5, "test_difficulty": "high", "passengers": [{"y": 3, "x": 2, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "height": 3, "tag": 1, "fuel_station": [], "agent": {"y": 3, "x": 2, "has_passenger": 0}, "tolls": [{"y": 2, "x": 2}, {"y": 2, "x": 3}], "opt_actions": ["pickup", "down", "down", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "env_code": [0, 0, 0, 1, 1, 0, 0, 0], "gamma": 1, "width": 4, "opt_traj_reward": 0.6000000000000001, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}], [{"opt_traj_length": 8, "test_difficulty": "high", "passengers": [{"y": 3, "x": 4, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "height": 3, "tag": 2, "fuel_station": [], "agent": {"y": 2, "x": 4, "has_passenger": 0}, "tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}], "opt_actions": ["up", "pickup", "down", "down", "left", "left", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "env_code": [1, 1, 1, 1, 1, 1, 1, 1], "gamma": 1, "width": 4, "opt_traj_reward": 0.2, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}, {"opt_traj_length": 11, "test_difficulty": "high", "passengers": [{"y": 3, "x": 3, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "height": 3, "tag": 3, "fuel_station": [], "agent": {"y": 1, "x": 4, "has_passenger": 0}, "tolls": [{"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 3}], "opt_actions": ["left", "left", "up", "up", "right", "pickup", "left", "down", "down", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "env_code": [0, 1, 1, 0, 1, 0, 0, 0], "gamma": 1, "width": 4, "opt_traj_reward": 0.4000000000000001, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}], [{"opt_traj_length": 7, "test_difficulty": "high", "passengers": [{"y": 1, "x": 4, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "height": 3, "tag": 4, "fuel_station": [], "agent": {"y": 1, "x": 2, "has_passenger": 0}, "tolls": [{"y": 2, "x": 3}, {"y": 1, "x": 2}, {"y": 1, "x": 3}], "opt_actions": ["right", "right", "pickup", "left", "left", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "env_code": [0, 0, 0, 0, 1, 0, 1, 1], "gamma": 1, "width": 4, "opt_traj_reward": 0.3333333333333333, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}, {"opt_traj_length": 10, "test_difficulty": "high", "passengers": [{"y": 3, "x": 3, "in_taxi": 0, "dest_x": 1, "dest_y": 1}], "height": 3, "tag": 5, "fuel_station": [], "agent": {"y": 1, "x": 3, "has_passenger": 0}, "tolls": [{"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 1, "x": 2}, {"y": 1, "x": 3}], "opt_actions": ["right", "up", "up", "left", "pickup", "left", "down", "down", "left", "dropoff"], "walls": [{"y": 3, "x": 1}, {"y": 2, "x": 1}], "traffic": [], "env_code": [0, 0, 0, 1, 1, 0, 1, 1], "gamma": 1, "width": 4, "opt_traj_reward": 0.3333333333333334, "available_tolls": [{"y": 3, "x": 2}, {"y": 3, "x": 3}, {"y": 3, "x": 4}, {"y": 2, "x": 2}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 1, "x": 2}, {"y": 1, "x": 3}]}]]}, "two_goal": {"low": [[{"opt_traj_length": 2, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 0, "test_difficulty": "low", "env_code": [1, 1, 0, 0, 0, 0], "height": 5, "agent": {"y": 3, "x": 4}, "walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}], "opt_actions": ["down", "right"], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.45333333333333337}, {"opt_traj_length": 1, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 2, "test_difficulty": "low", "env_code": [1, 0, 0, 0, 1, 0], "height": 5, "agent": {"y": 1, "x": 5}, "walls": [{"y": 4, "x": 1}, {"y": 2, "x": 4}], "opt_actions": ["up"], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.5066666666666667}], [{"opt_traj_length": 1, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 3, "test_difficulty": "low", "env_code": [0, 1, 0, 0, 0, 0], "height": 5, "agent": {"y": 3, "x": 5}, "walls": [{"y": 4, "x": 2}], "opt_actions": ["down"], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.5066666666666667}, {"opt_traj_length": 2, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 4, "test_difficulty": "low", "env_code": [1, 1, 0, 0, 0, 0], "height": 5, "agent": {"y": 2, "x": 3}, "walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}], "opt_actions": ["right", "right"], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.45333333333333337}], [{"opt_traj_length": 2, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 1, "test_difficulty": "low", "env_code": [0, 0, 0, 0, 1, 1], "height": 5, "agent": {"y": 1, "x": 4}, "walls": [{"y": 2, "x": 4}, {"y": 3, "x": 5}], "opt_actions": ["right", "up"], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.45333333333333337}, {"opt_traj_length": 1, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 5, "test_difficulty": "low", "env_code": [1, 1, 1, 0, 0, 1], "height": 5, "agent": {"y": 2, "x": 4}, "walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 3, "x": 5}], "opt_actions": ["right"], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.5066666666666667}]], "medium": [[{"opt_traj_length": 6, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 0, "test_difficulty": "medium", "height": 5, "agent": {"y": 5, "x": 2}, "walls": [{"y": 4, "x": 2}, {"y": 2, "x": 3}, {"y": 3, "x": 5}], "opt_actions": ["right", "down", "down", "right", "down", "right"], "env_code": [0, 1, 0, 1, 0, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.24000000000000005}, {"opt_traj_length": 6, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 2, "test_difficulty": "medium", "height": 5, "agent": {"y": 3, "x": 4}, "walls": [{"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "opt_actions": ["left", "down", "down", "right", "right", "up"], "env_code": [0, 1, 1, 0, 1, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.24000000000000005}], [{"opt_traj_length": 5, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 1, "test_difficulty": "medium", "height": 5, "agent": {"y": 5, "x": 2}, "walls": [{"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "opt_actions": ["left", "down", "down", "down", "down"], "env_code": [0, 1, 1, 0, 1, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.12}, {"opt_traj_length": 5, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 5, "test_difficulty": "medium", "height": 5, "agent": {"y": 5, "x": 5}, "walls": [{"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 3, "x": 5}], "opt_actions": ["down", "left", "down", "down", "right"], "env_code": [0, 0, 1, 1, 0, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.2933333333333334}], [{"opt_traj_length": 3, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 3, "test_difficulty": "medium", "height": 5, "agent": {"y": 4, "x": 1}, "walls": [{"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "opt_actions": ["down", "down", "down"], "env_code": [0, 0, 1, 1, 1, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.22666666666666666}, {"opt_traj_length": 5, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 4, "test_difficulty": "medium", "height": 5, "agent": {"y": 5, "x": 5}, "walls": [{"y": 4, "x": 2}, {"y": 3, "x": 5}], "opt_actions": ["down", "left", "down", "down", "right"], "env_code": [0, 1, 0, 0, 0, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.2933333333333334}]], "high": [[{"opt_traj_length": 9, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 0, "test_difficulty": "high", "height": 5, "agent": {"y": 5, "x": 1}, "walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "opt_actions": ["right", "right", "down", "down", "down", "down", "right", "right", "up"], "env_code": [1, 1, 0, 0, 1, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.08000000000000002}, {"opt_traj_length": 8, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 4, "test_difficulty": "high", "height": 5, "agent": {"y": 5, "x": 2}, "walls": [{"y": 4, "x": 2}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "opt_actions": ["right", "down", "down", "down", "down", "right", "right", "up"], "env_code": [0, 1, 0, 0, 1, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.13333333333333336}], [{"opt_traj_length": 9, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 2, "test_difficulty": "high", "height": 5, "agent": {"y": 5, "x": 3}, "walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "opt_actions": ["right", "down", "down", "left", "down", "down", "right", "right", "up"], "env_code": [1, 1, 1, 0, 1, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.08000000000000002}, {"opt_traj_length": 7, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 5, "test_difficulty": "high", "height": 5, "agent": {"y": 5, "x": 1}, "walls": [{"y": 4, "x": 3}, {"y": 2, "x": 3}], "opt_actions": ["down", "down", "right", "right", "right", "down", "right"], "env_code": [0, 0, 1, 1, 0, 0], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.1866666666666667}], [{"opt_traj_length": 9, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 1, "test_difficulty": "high", "height": 5, "agent": {"y": 5, "x": 3}, "walls": [{"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "opt_actions": ["right", "down", "down", "left", "down", "down", "right", "right", "up"], "env_code": [0, 1, 1, 0, 1, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.08000000000000002}, {"opt_traj_length": 9, "goals": [{"y": 1, "x": 1}, {"y": 2, "x": 5}], "tag": 3, "test_difficulty": "high", "height": 5, "agent": {"y": 5, "x": 1}, "walls": [{"y": 4, "x": 1}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "opt_actions": ["right", "down", "down", "down", "down", "right", "right", "right", "up"], "env_code": [1, 0, 1, 1, 1, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 1}, {"y": 4, "x": 2}, {"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 4}, {"y": 3, "x": 5}], "width": 5, "opt_traj_reward": 0.08000000000000002}]]}, "skateboard": {"low": [[{"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 2, "x": 4, "on_agent": 0}], "tag": 0, "test_difficulty": "low", "height": 4, "agent": {"y": 3, "x": 7, "has_skateboard": 0}, "opt_traj_length": 2, "walls": [{"y": 4, "x": 3}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["up", "left"], "env_code": [1, 0, 0, 0], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.6796116504854368}, {"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 1, "x": 7, "on_agent": 0}], "tag": 1, "test_difficulty": "low", "height": 4, "agent": {"y": 4, "x": 7, "has_skateboard": 0}, "opt_traj_length": 1, "walls": [{"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["left"], "env_code": [0, 1, 1, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.7766990291262136}], [{"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 1, "x": 1, "on_agent": 0}], "tag": 4, "test_difficulty": "low", "height": 4, "agent": {"y": 2, "x": 7, "has_skateboard": 0}, "opt_traj_length": 3, "walls": [{"y": 2, "x": 3}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["up", "up", "left"], "env_code": [0, 0, 1, 0], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.5825242718446602}, {"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 1, "x": 2, "on_agent": 0}], "tag": 3, "test_difficulty": "low", "height": 4, "agent": {"y": 4, "x": 7, "has_skateboard": 0}, "opt_traj_length": 1, "walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 2}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["left"], "env_code": [1, 1, 0, 1], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.7766990291262136}], [{"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 1, "x": 1, "on_agent": 0}], "tag": 4, "test_difficulty": "low", "height": 4, "agent": {"y": 2, "x": 7, "has_skateboard": 0}, "opt_traj_length": 3, "walls": [{"y": 2, "x": 3}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["up", "up", "left"], "env_code": [0, 0, 1, 0], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.5825242718446602}, {"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 1, "x": 7, "on_agent": 0}], "tag": 5, "test_difficulty": "low", "height": 4, "agent": {"y": 3, "x": 7, "has_skateboard": 0}, "opt_traj_length": 2, "walls": [{"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["up", "left"], "env_code": [0, 0, 0, 0], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.6796116504854368}]], "medium": [[{"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 4, "x": 1, "on_agent": 0}], "tag": 0, "test_difficulty": "medium", "env_code": [0, 1, 1, 0], "height": 4, "agent": {"y": 2, "x": 4, "has_skateboard": 0}, "opt_traj_length": 8, "walls": [{"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["down", "right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.09708737864077666}, {"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 2, "x": 1, "on_agent": 0}], "tag": 3, "test_difficulty": "medium", "env_code": [1, 1, 1, 1], "height": 4, "agent": {"y": 1, "x": 4, "has_skateboard": 0}, "opt_traj_length": 7, "walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.1941747572815533}], [{"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 4, "x": 1, "on_agent": 0}], "tag": 1, "test_difficulty": "medium", "env_code": [1, 1, 0, 0], "height": 4, "agent": {"y": 1, "x": 4, "has_skateboard": 0}, "opt_traj_length": 7, "walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.1941747572815533}, {"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 2, "x": 1, "on_agent": 0}], "tag": 4, "test_difficulty": "medium", "env_code": [1, 0, 1, 0], "height": 4, "agent": {"y": 2, "x": 4, "has_skateboard": 0}, "opt_traj_length": 8, "walls": [{"y": 4, "x": 3}, {"y": 2, "x": 3}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["down", "right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.09708737864077666}], [{"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 4, "x": 2, "on_agent": 0}], "tag": 2, "test_difficulty": "medium", "env_code": [0, 0, 0, 0], "height": 4, "agent": {"y": 1, "x": 4, "has_skateboard": 0}, "opt_traj_length": 7, "walls": [{"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.1941747572815533}, {"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 2, "x": 1, "on_agent": 0}], "tag": 5, "test_difficulty": "medium", "env_code": [0, 0, 0, 1], "height": 4, "agent": {"y": 2, "x": 4, "has_skateboard": 0}, "opt_traj_length": 8, "walls": [{"y": 2, "x": 2}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["down", "right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.09708737864077666}]], "high": [[{"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 2, "x": 4, "on_agent": 0}], "tag": 0, "test_difficulty": "high", "env_code": [0, 1, 1, 1], "height": 4, "agent": {"y": 3, "x": 2, "has_skateboard": 0}, "opt_traj_length": 14, "walls": [{"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["up", "right", "right", "down", "down", "pickup", "down", "right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.12621359223300965}, {"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 1, "x": 4, "on_agent": 0}], "tag": 1, "test_difficulty": "high", "env_code": [1, 1, 0, 1], "height": 4, "agent": {"y": 1, "x": 6, "has_skateboard": 0}, "opt_traj_length": 10, "walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 2}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["left", "left", "pickup", "right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.44660194174757273}], [{"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 3, "x": 3, "on_agent": 0}], "tag": 2, "test_difficulty": "high", "env_code": [0, 0, 1, 0], "height": 4, "agent": {"y": 1, "x": 4, "has_skateboard": 0}, "opt_traj_length": 14, "walls": [{"y": 2, "x": 3}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["up", "up", "left", "pickup", "right", "down", "down", "right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.2621359223300971}, {"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 3, "x": 4, "on_agent": 0}], "tag": 3, "test_difficulty": "high", "env_code": [0, 0, 1, 1], "height": 4, "agent": {"y": 1, "x": 2, "has_skateboard": 0}, "opt_traj_length": 14, "walls": [{"y": 2, "x": 3}, {"y": 2, "x": 2}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["right", "right", "up", "up", "pickup", "down", "down", "right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.19417475728155337}], [{"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 1, "x": 1, "on_agent": 0}], "tag": 4, "test_difficulty": "high", "env_code": [0, 0, 0, 0], "height": 4, "agent": {"y": 1, "x": 4, "has_skateboard": 0}, "opt_traj_length": 14, "walls": [{"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["left", "left", "left", "pickup", "right", "right", "right", "right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.2621359223300971}, {"goal": {"y": 4, "x": 6}, "skateboard": [{"y": 3, "x": 3, "on_agent": 0}], "tag": 5, "test_difficulty": "high", "env_code": [1, 0, 0, 0], "height": 4, "agent": {"y": 1, "x": 1, "has_skateboard": 0}, "opt_traj_length": 15, "walls": [{"y": 4, "x": 3}, {"y": 4, "x": 5}, {"y": 3, "x": 5}, {"y": 2, "x": 5}, {"y": 3, "x": 6}, {"y": 2, "x": 6}], "opt_actions": ["up", "up", "right", "right", "pickup", "down", "down", "right", "right", "right", "right", "up", "up", "up", "left"], "gamma": 1, "available_walls": [{"y": 4, "x": 3}, {"y": 3, "x": 3}, {"y": 2, "x": 3}, {"y": 2, "x": 2}], "width": 7, "opt_traj_reward": 0.16504854368932037}]]}}

    augmented_taxi_testing.push(testing_simulation("/static/external/augmented_taxi.html", testing_mdp_parameters['augmented_taxi']['low'][train_test_set][0], 'augmented_taxi', testing_simulation_header));
    augmented_taxi_testing.push(testing_simulation("/static/external/augmented_taxi.html", testing_mdp_parameters['augmented_taxi']['low'][train_test_set][1], 'augmented_taxi', testing_simulation_header));
    augmented_taxi_testing.push(testing_simulation("/static/external/augmented_taxi.html", testing_mdp_parameters['augmented_taxi']['medium'][train_test_set][0], 'augmented_taxi', testing_simulation_header));
    augmented_taxi_testing.push(testing_simulation("/static/external/augmented_taxi.html", testing_mdp_parameters['augmented_taxi']['medium'][train_test_set][1], 'augmented_taxi', testing_simulation_header));
    augmented_taxi_testing.push(testing_simulation("/static/external/augmented_taxi.html", testing_mdp_parameters['augmented_taxi']['high'][train_test_set][0], 'augmented_taxi', testing_simulation_header));
    augmented_taxi_testing.push(testing_simulation("/static/external/augmented_taxi.html", testing_mdp_parameters['augmented_taxi']['high'][train_test_set][1], 'augmented_taxi', testing_simulation_header));
    two_goal_testing.push(testing_simulation("/static/external/two_goal.html", testing_mdp_parameters['two_goal']['low'][train_test_set][0], 'two_goal', testing_simulation_header));
    two_goal_testing.push(testing_simulation("/static/external/two_goal.html", testing_mdp_parameters['two_goal']['low'][train_test_set][1], 'two_goal', testing_simulation_header));
    two_goal_testing.push(testing_simulation("/static/external/two_goal.html", testing_mdp_parameters['two_goal']['medium'][train_test_set][0], 'two_goal', testing_simulation_header));
    two_goal_testing.push(testing_simulation("/static/external/two_goal.html", testing_mdp_parameters['two_goal']['medium'][train_test_set][1], 'two_goal', testing_simulation_header));
    two_goal_testing.push(testing_simulation("/static/external/two_goal.html", testing_mdp_parameters['two_goal']['high'][train_test_set][0], 'two_goal', testing_simulation_header));
    two_goal_testing.push(testing_simulation("/static/external/two_goal.html", testing_mdp_parameters['two_goal']['high'][train_test_set][1], 'two_goal', testing_simulation_header));
    skateboard_testing.push(testing_simulation("/static/external/skateboard.html", testing_mdp_parameters['skateboard']['low'][train_test_set][0], 'skateboard', testing_simulation_header));
    skateboard_testing.push(testing_simulation("/static/external/skateboard.html", testing_mdp_parameters['skateboard']['low'][train_test_set][1], 'skateboard', testing_simulation_header));
    skateboard_testing.push(testing_simulation("/static/external/skateboard.html", testing_mdp_parameters['skateboard']['medium'][train_test_set][0], 'skateboard', testing_simulation_header));
    skateboard_testing.push(testing_simulation("/static/external/skateboard.html", testing_mdp_parameters['skateboard']['medium'][train_test_set][1], 'skateboard', testing_simulation_header));
    skateboard_testing.push(testing_simulation("/static/external/skateboard.html", testing_mdp_parameters['skateboard']['high'][train_test_set][0], 'skateboard', testing_simulation_header));
    skateboard_testing.push(testing_simulation("/static/external/skateboard.html", testing_mdp_parameters['skateboard']['high'][train_test_set][1], 'skateboard', testing_simulation_header));

    // shuffle the testing arrays to mix between low, medium, and high test difficulties
    augmented_taxi_testing = shuffle(augmented_taxi_testing);
    two_goal_testing = shuffle(two_goal_testing);
    skateboard_testing = shuffle(skateboard_testing);

    switch (counterbalance) {
        case 0:
            order = ['augmented_taxi', 'two_goal', 'skateboard'];
            break;
        case 1:
            order = ['augmented_taxi', 'skateboard', 'two_goal'];
            break;
        case 2:
            order = ['two_goal', 'augmented_taxi', 'skateboard'];
            break;
        case 3:
            order = ['two_goal', 'skateboard', 'augmented_taxi'];
            break;
        case 4:
            order = ['skateboard', 'augmented_taxi', 'two_goal'];
            break;
        case 5:
            order = ['skateboard', 'two_goal', 'augmented_taxi'];
            break;
    }

    timeline = [];

    // intro pages
    timeline.push(instructions_intro);
    timeline.push(instructions_overview);

    // practice game
    timeline.push(sandbox_introduction);
    timeline.push(testing_simulation("/static/external/sandbox.html", sandbox_1_parameters, 'sandbox', sandbox_2_header, 'free_play'));
    timeline.push(testing_simulation("/static/external/sandbox.html", sandbox_1_parameters, 'sandbox', sandbox_3_header, 'optimal_traj_1'));
    timeline.push(testing_simulation("/static/external/sandbox.html", sandbox_2_parameters, 'sandbox', sandbox_4_header, 'optimal_traj_2'));
    timeline.push(testing_simulation("/static/external/sandbox.html", sandbox_2_parameters, 'sandbox', sandbox_5_header, 'exit'));
    timeline.push(post_practice_button);

    /* BEGIN DEBUGGING */
    // 1) individual training videos
    // timeline.push(training_video('/static/vid/ll_bad_env_1.mp4', 'augmented_taxi'));
    // timeline.push(training_video('/static/vid/k0/taxi_2a.mp4', 'augmented_taxi'));
    // timeline.push(training_video('/static/vid/k0/tg_2b.mp4', 'two_goal'));
    // timeline.push(training_video('/static/vid/k0/skateboard_2a.mp4', 'skateboard'));

    // 2) individual testing simulations
    // timeline.push(testing_simulation("/static/external/sandbox.html", testing_mdp_parameters['augmented_taxi']['low'][train_test_set][0], 'sandbox', testing_simulation_header));
    // timeline.push(testing_simulation("/static/external/augmented_taxi.html", testing_mdp_parameters['augmented_taxi']['low'][train_test_set][0], 'augmented_taxi', testing_simulation_header));
    // timeline.push(testing_simulation("/static/external/two_goal.html", testing_mdp_parameters['two_goal']['low'][train_test_set][0], 'two_goal', testing_simulation_header));
    // timeline.push(testing_simulation("/static/external/skateboard.html", testing_mdp_parameters['skateboard']['low'][train_test_set][0], 'skateboard', testing_simulation_header));
    // timeline.push(post_practice_button);
    /* END DEBUGGING */

    for (var i = 0; i < order.length; i++) {
        if (order[i] == 'augmented_taxi') {
            timeline.push(augmented_taxi_introduction);

            for (var j = 0; j < augmented_taxi_training.length; j++) {
                timeline.push(augmented_taxi_training[j]);
            }

            timeline.push(training_survey('augmented_taxi'));

            for (var k = 0; k < augmented_taxi_testing.length; k++) {
                timeline.push(augmented_taxi_testing[k]);
            }
        } else if (order[i] == 'two_goal') {
            timeline.push(two_goal_introduction);

            for (var j = 0; j < two_goal_training.length; j++) {
                timeline.push(two_goal_training[j]);
            }

            timeline.push(training_survey('two_goal'));

            for (var k = 0; k < two_goal_testing.length; k++) {
                timeline.push(two_goal_testing[k]);
            }
        } else {
            timeline.push(skateboard_introduction);

            for (var j = 0; j < skateboard_training.length; j++) {
                timeline.push(skateboard_training[j]);
            }

            timeline.push(training_survey('skateboard'));

            for (var k = 0; k < skateboard_testing.length; k++) {
                timeline.push(skateboard_testing[k]);
            }
        }
        if (i < order.length - 1) {
            timeline.push(post_main_game_button);
        }
    }
    timeline.push(post_study_survey);
    timeline.push(debrief);

    jsPsych.init({
        timeline: timeline,
        show_progress_bar: true,
        display_element: 'jspsych-target',

        on_finish: function () {
            psiTurk.saveData({
                success: function() {
                    psiTurk.completeHIT();
                }
            });
        // jsPsych.data.displayData();
        },

        on_data_update:function(data) {
            psiTurk.recordTrialData(data)
            psiTurk.saveData()
        }
    });


// TODO(pkoppol): When do things like 'CompleteHit' come into play?