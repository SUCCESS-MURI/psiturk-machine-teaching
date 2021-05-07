from sqlalchemy import create_engine, MetaData, Table
import json
import pandas as pd
import numpy as np
import matplotlib
import math
from scipy import stats
from sklearn.metrics import cohen_kappa_score

matplotlib.use('tkagg')
import matplotlib.pyplot as plt
import pingouin as pg
import sqlite3
import pickle
import dbkeys
import csv
import itertools
import altair as alt
alt.renderers.enable('altair_viewer')
alt.renderers.set_embed_options(scaleFactor=5)
from altair_saver import save
import seaborn as sns
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Chrome('./chromedriver', chrome_options=chrome_options)

'''
CONSTANTS and FLAGS
'''


CONDITION_MAPPING = {0: 'Low information class', 1: 'Medium information class', 2: 'Highest information class (SCOT)', 3: 'No scaffolding + non-optimized visuals', 4: 'Forward scaffolding + non-optimized visuals', 5: 'Backward scaffolding + non-optimized visuals', 6: 'No scaffolding + optimized visuals', 7: 'Forward scaffolding + optimized visuals', 8: 'Backward scaffolding + optimized visuals'}
SCAFFOLDING_MAPPING = {0: 'Low', 1: 'Medium', 2: 'Maximum', 3: 'None', 4: 'Forward', 5: 'Backward'}
OPT_VISUALS_MAPPING = {0: 'Negative', 1: 'Positive'}
TEST_DIFFICULTY_MAPPING = {0: 'Low', 1: 'Medium', 2: 'High'}
TEST_DIFFICULTY_NUMBERED_MAPPING = {0: '0: Low', 1: '1: Medium', 2: '2: High'}
INFORMATIVENESS_MAPPING = {0: "Not Informative", 1: "Slightly", 2: "Moderately", 3: "Very", 4: "Extremely"}
INFORMATIVENESS_NUMBERED_MAPPING = {0: "0: Not Informative", 1: "1: Slightly -", 2: "2: Moderately -", 3: "3: Very -", 4: "4: Extremely Informative"}
MENTAL_EFFORT_MAPPING = {0: "No Effort", 1: "Slight", 2: "Moderate", 3: "Significant", 4: "Extreme"}
MENTAL_EFFORT_NUMBERED_MAPPING = {0: "0: No Effort", 1: "1: Slight -", 2: "2: Moderate -", 3: "3: Significant -", 4: "4: Extreme Effort"}
PUZZLEMENT_MAPPING = {0: "Not Puzzled", 1: "Slightly", 2: "Moderately", 3: "Very", 4: "Extremely"}
PUZZLEMENT_NUMBERED_MAPPING = {0: "0: Not Puzzled", 1: "1: Slightly -", 2: "2: Moderately -", 3: "3: Very -", 4: "4: Extremely Puzzled"}
CONFIDENCE_MAPPING = {0: "Not Confident", 1: "Slightly -", 2: "Somewhat -", 3: "Very -", 4: "Extremely Confident"}
CONFIDENCE_NUMBERED_MAPPING = {0: "0: Not Confident", 1: "1: Slightly -", 2: "2: Somewhat -", 3: "3: Very -", 4: "4: Extremely Confident"}

CONDITION_LABELS = [item[1] for item in CONDITION_MAPPING.items()]
SCAFFOLDING_LABELS = [item[1] for item in SCAFFOLDING_MAPPING.items()]
OPT_VISUALS_LABELS = [item[1] for item in OPT_VISUALS_MAPPING.items()]
TEST_DIFFICULTY_LABELS = [item[1] for item in TEST_DIFFICULTY_MAPPING.items()]
TEST_DIFFICULTY_NUMBERED_LABELS = [item[1] for item in TEST_DIFFICULTY_NUMBERED_MAPPING.items()]
INFORMATIVENESS_LABELS = [item[1] for item in INFORMATIVENESS_MAPPING.items()]
INFORMATIVENESS_NUMBERED_LABELS = [item[1] for item in INFORMATIVENESS_NUMBERED_MAPPING.items()]
MENTAL_EFFORT_LABELS = [item[1] for item in MENTAL_EFFORT_MAPPING.items()]
MENTAL_EFFORT_NUMBERED_LABELS = [item[1] for item in MENTAL_EFFORT_NUMBERED_MAPPING.items()]
PUZZLEMENT_LABELS = [item[1] for item in PUZZLEMENT_MAPPING.items()]
PUZZLEMENT_NUMBERED_LABELS = [item[1] for item in PUZZLEMENT_NUMBERED_MAPPING.items()]
CONFIDENCE_LABELS = [item[1] for item in CONFIDENCE_MAPPING.items()]
CONFIDENCE_NUMBERED_LABELS = [item[1] for item in CONFIDENCE_NUMBERED_MAPPING.items()]

alpha = 0.05

'''
 START: BOILER PLATE SET UP
'''

def get_remote_data(filename=''):
    db_url = dbkeys.db_url
    table_name = dbkeys.table_name
    data_column_name = dbkeys.data_column_name
    # boilerplace sqlalchemy setup
    engine = create_engine(db_url)
    metadata = MetaData()
    metadata.bind = engine
    table = Table(table_name, metadata, autoload=True)
    # make a query and loop through
    s = table.select()
    rows = s.execute()

    data = []

    # status codes of subjects who completed experiment
    statuses = [3, 4, 5, 7]
    # if you have workers you wish to exclude, add them here
    # excluding my own test
    exclude = dbkeys.exclude
    for row in rows:
        # print(row)
        # only use subjects who completed experiment and aren't excluded
        if row['status'] in statuses and row['uniqueid'] not in exclude:
            data.append(row[data_column_name])

    # For use when not excluding participants:
    # for row in rows:
    #        data.append(row[data_column_name])
    #        #ids.append((row['assignmentID'], condition))

    # Now we have all participant datastrings in a list.
    # Let's make it a bit easier to work with:

    # parse each participant's datastring as json object
    # and take the 'data' sub-object
    data = [json.loads(part)['data'] for part in data]
    # insert uniqueid field into trialdata in case it wasn't added
    # in experiment:
    for part in data:
        for record in part:
            # only record the prolific ID as the uniqueid for 1:1 interfacing with Prolific
            record['trialdata']['uniqueid'] = record['uniqueid'].split(':')[0]
            # record['trialdata']['uniqueid'] = record['uniqueid']


    # flatten nested list so we just have a list of the trialdata recorded
    # each time psiturk.recordTrialData(trialdata) was called.
    data = [record['trialdata'] for part in data for record in part]

    # Put all subjects' trial data into a dataframe object from the
    # 'pandas' python library: one option among many for analysis
    df = pd.DataFrame(data)

    return df

def get_local_data():
    global df_training_exp1
    global df_training_exp2
    global df_testing
    global df_testing_sandbox
    global df_training_survey_exp1
    global df_training_survey_exp2
    global df_post_survey

    # local data from a local pickled df file
    with open('dfs_processed_masked.pickle', 'rb') as f:
        df_training_exp1, df_training_exp2, df_testing, df_testing_sandbox, df_training_survey_exp1, df_training_survey_exp2, df_post_survey = pickle.load(f)

'''
 END: BOILER PLATE SET UP
'''

'''
 START: TABLE DEFINITIONS
'''

def edit_tables(df, flagged_ids):
    # Need to remove flagged ids from analysis
    for id in flagged_ids:
        df = df[df.uniqueid != id]

    table_setup(df)

    return df

def split_questions_into_columns(df_to, df_from, start, keys):
    for i, key in enumerate(keys):
        qname = key
        df_to.insert(i + start, qname, df_from[i], True)
    return

def translate_conditions(df_translate):
    df_translate['scaffolding'] = 0
    df_translate['opt_visuals'] = 0

    for i in df_translate.index:
        condition = df_translate.at[i, 'condition']
        if condition == 0:
            df_translate.at[i, 'scaffolding'] = 0
            df_translate.at[i, 'opt_visuals'] = 1
        elif condition == 1:
            df_translate.at[i, 'scaffolding'] = 1
            df_translate.at[i, 'opt_visuals'] = 1
        elif condition == 2:
            df_translate.at[i, 'scaffolding'] = 2
            df_translate.at[i, 'opt_visuals'] = 1
        elif condition == 3:
            df_translate.at[i, 'scaffolding'] = 3
            df_translate.at[i, 'opt_visuals'] = 0
        elif condition == 4:
            df_translate.at[i, 'scaffolding'] = 4
            df_translate.at[i, 'opt_visuals'] = 0
        elif condition == 5:
            df_translate.at[i, 'scaffolding'] = 5
            df_translate.at[i, 'opt_visuals'] = 0
        elif condition == 6:
            df_translate.at[i, 'scaffolding'] = 3
            df_translate.at[i, 'opt_visuals'] = 1
        elif condition == 7:
            df_translate.at[i, 'scaffolding'] = 4
            df_translate.at[i, 'opt_visuals'] = 1
        elif condition == 8:
            df_translate.at[i, 'scaffolding'] = 5
            df_translate.at[i, 'opt_visuals'] = 1

    return df_translate

def flag_ids():
    participants = df_post_survey.uniqueid.unique()
    incomplete = []
    multiple_responses_warning = []
    multiple_responses_error = []
    too_quick = []

    print("\n========== FLAGGING INCOMPLETE DATA ==========")

    for participant in participants:
        data_participant = df_post_survey[df_post_survey.uniqueid == participant]

        if len(data_participant.index) == 0:
            print(participant)
            incomplete.append(participant)

    print("\n========== FLAGGING MULTIPLE RESPONSES ==========")

    for participant in participants:
        # Find participants who completed the survey more than once
        data_participant = df_testing_sandbox[df_testing_sandbox.uniqueid == participant]

        n_sandbox_entries = len(data_participant[data_participant.domain == 'sandbox'])
        # critial data has been affected
        if n_sandbox_entries >= 8:
            print("# sandbox entries: {}".format(n_sandbox_entries))
            condition = data_participant.condition.values[0]
            if condition in [0, 1, 2]:
                if len(df_training_exp1[df_training_exp1.uniqueid == participant].index) > 7:
                    multiple_responses_error.append(participant)
            else:
                if len(df_training_exp2[df_training_exp2.uniqueid == participant].index) > 15:
                    multiple_responses_error.append(participant)
        # critical data has not been affected
        elif n_sandbox_entries > 4:
            print("# sandbox entries: {}".format(n_sandbox_entries))
            multiple_responses_warning.append(participant)

    print("\n========== FLAGGING QUICK RESPONSES ==========")

    for participant in participants:
        # Find participants who completed the survey too quickly
        data_participant = df_post_survey[df_post_survey.uniqueid == participant]

        time_elapsed = data_participant.time_elapsed / (1000 * 60)  # in minutes
        if len(time_elapsed) > 1:
            AssertionError("There should only be one post study survey entry per unique id")
        if time_elapsed.values[0] < 10:
            print(time_elapsed.values[0])
            # print(df_post_survey[df_post_survey.uniqueid == participant].primary_answer) # this is for the pilot
            too_quick.append(participant)

    print("Soft flagging (" + str(len(multiple_responses_warning)) + ") for restarting study before reaching real study: " + str(multiple_responses_warning))
    print("Soft flagging (" + str(len(too_quick)) + ") for completing for completing the study too quickly: " + str(too_quick))
    print("Hard flagging (" + str(len(multiple_responses_error)) + ") for restarting study after reaching real study: " + str(multiple_responses_error))
    print("Hard flagging (" + str(len(incomplete)) + ") for not completing the study: " + str(incomplete))
    print("Hard flagging (" + str(len(dbkeys.manually_flagged_ids)) + ") as manually flagged ids : " + str(dbkeys.manually_flagged_ids))

    flagged_ids = multiple_responses_error + incomplete + dbkeys.manually_flagged_ids
    print("Flagged " + str(len(flagged_ids)) + " total.")

    return flagged_ids

def table_setup(df):
    global df_training_exp1
    global df_training_exp2
    global df_testing
    global df_testing_sandbox
    global df_training_survey_exp1
    global df_training_survey_exp2
    global df_post_survey

    ############ Training video ############
    df_training = df[
        ['uniqueid', 'interaction_type', 'condition', 'counterbalance', 'train_test_set', 'domain', 'training_traj_length',
         'primary_misc']]
    df_training = df_training[df_training['interaction_type'] == 'training_video']
    df_training = translate_conditions(df_training)
    df_training['n_video_loops'] = 0.0

    # process the number of video loops
    for i in df_training.index:
        n_video_loops = df_training.at[i, 'primary_misc']['stimulus_video_loops']

        # add any additional view time
        if (df_training.at[i, 'primary_misc']['stimulus_vid_curr_time'] != df_training.at[i, 'primary_misc'][
            'video_length']):
            n_video_loops += df_training.at[i, 'primary_misc']['stimulus_vid_curr_time'] / \
                             df_training.at[i, 'primary_misc']['video_length']

        df_training.at[i, 'n_video_loops'] = n_video_loops

    # separate df_testing into experiment 1 and experiment 2
    df_training_exp1 = df_training[df_training.condition.isin([0, 1, 2])]
    df_training_exp2 = df_training[df_training.condition.isin([3, 4, 5, 6, 7, 8])]

    ############ Training survey ############
    df_training_survey = df[['uniqueid', 'condition', 'counterbalance', 'train_test_set', 'domain', 'primary_stimulus', 'primary_rt', 'primary_answer', 'question_type']]
    df_training_survey = df_training_survey[df_training_survey.question_type == 'interim_survey']
    df_training_survey = translate_conditions(df_training_survey)

    # separate out likert scale questions here
    keys = json.loads(df_training_survey['primary_answer'][df_training_survey['primary_answer'].sample().index[0]]).keys()
    df_training_survey['primary_answer'] = df_training_survey['primary_answer'].apply(likert_series_to_json, keys=keys)
    df_split = df_training_survey['primary_answer'].apply(lambda x: pd.Series(x.split('@')))
    split_questions_into_columns(df_training_survey, df_split, len(df_training_survey.keys()), keys)

    # convert likert scale responses to be numeric
    df_training_survey.loc[:, ['Q0']] = df_training_survey['Q0'].apply(pd.to_numeric)
    df_training_survey.loc[:, ['Q1']] = df_training_survey['Q1'].apply(pd.to_numeric)
    df_training_survey.loc[:, ['Q2']] = df_training_survey['Q2'].apply(pd.to_numeric)

    # add string-labeled entries for plotting
    df_training_survey['Q0_string'] = df_training_survey['Q0'].apply(id_to_informativeness)
    df_training_survey['Q1_string'] = df_training_survey['Q1'].apply(id_to_mental_effort)
    df_training_survey['Q2_string'] = df_training_survey['Q2'].apply(id_to_puzzlement)

    # separate df_testing into experiment 1 and experiment 2
    df_training_survey_exp1 = df_training_survey[df_training_survey.condition.isin([0, 1, 2])].copy()
    df_training_survey_exp2 = df_training_survey[df_training_survey.condition.isin([3, 4, 5, 6, 7, 8])].copy()

    df_training_survey_exp1['scaffolding_string'] = df_training_survey_exp1['scaffolding'].apply(
        id_to_scaffolding)
    df_training_survey_exp2['scaffolding_string'] = df_training_survey_exp2['scaffolding'].apply(
        id_to_scaffolding)
    df_training_survey_exp2['opt_visuals_string'] = df_training_survey_exp2['opt_visuals'].apply(
        id_to_opt_visuals)

    ############ Testing simulation ############
    df_testing = df[
        ['uniqueid', 'interaction_type', 'condition', 'counterbalance', 'train_test_set', 'domain', 'primary_answer', 'primary_rt', 'test_mdp',
         'likert_rt', 'likert_response', 'likert_question_order']]
    df_testing = df_testing[df_testing['interaction_type'] == 'testing_simulation']
    df_testing_sandbox = df_testing[df_testing['domain'] == 'sandbox']
    df_testing = df_testing[df_testing['domain'] != 'sandbox']
    df_testing = translate_conditions(df_testing)
    df_testing['scaled_human_reward'] = 0.0
    df_testing['test_difficulty'] = 0
    df_testing['normalized_primary_rt'] = 0.0
    df_testing['normalized_simulation_rt'] = 0.0

    # separate out simulation_rt and moves
    keys = json.loads(df_testing['primary_answer'][df_testing['primary_answer'].sample().index[0]]).keys()
    df_testing['primary_answer'] = df_testing['primary_answer'].apply(likert_series_to_json, keys=keys)
    df_split = df_testing['primary_answer'].apply(lambda x: pd.Series(x.split('@')))
    split_questions_into_columns(df_testing, df_split, len(df_testing.keys()), keys)

    # normalize primary_rt and simulation_rt and convert from milliseconds to seconds
    df_testing.loc[:, ['primary_rt']] = df_testing['primary_rt'].apply(pd.to_numeric)
    df_testing.loc[:, ['simulation_rt']] = df_testing['simulation_rt'].apply(pd.to_numeric)
    for i in df_testing.index:
        opt_traj_length = df_testing.test_mdp[i]['opt_traj_length']
        df_testing.at[i, 'normalized_simulation_rt'] = df_testing.at[i, 'simulation_rt'] / (opt_traj_length * 1000)
        df_testing.at[i, 'normalized_primary_rt'] = df_testing.at[i, 'primary_rt'] / (opt_traj_length * 1000)

    # separate out likert scale questions here (there is only one likert scale here)
    keys = json.loads(df_testing['likert_response'][df_testing['likert_response'].sample().index[0]]).keys()
    df_testing['likert_response'] = df_testing['likert_response'].apply(likert_series_to_json, keys=keys)
    df_testing.loc[:, ['likert_response']] = df_testing['likert_response'].apply(pd.to_numeric)

    # add string-labeled entries for plotting
    df_testing['condition_string'] = df_testing['condition'].apply(id_to_condition)
    df_testing['scaffolding_string'] = df_testing['scaffolding'].apply(id_to_scaffolding)
    df_testing['opt_visuals_string'] = df_testing['opt_visuals'].apply(id_to_opt_visuals)
    df_testing['likert_response_string'] = df_testing['likert_response'].apply(id_to_confidence)
    df_testing['likert_response_numbered_string'] = df_testing['likert_response'].apply(
        id_to_confidence_numbered)
    df_testing['experiment'] = df_testing['condition'].apply(id_to_experiment)

    ############ Post-study survey ############
    df_post_survey = df[['uniqueid', 'question_type', 'condition', 'counterbalance', 'train_test_set', 'primary_answer', 'time_elapsed']]
    df_post_survey = df_post_survey[df_post_survey['question_type'] == 'post_study_survey']

    # Parse responses
    # Here, Q0: Feedback, Q1: Age, Q2: Gender
    keys = json.loads(df_post_survey['primary_answer'][df_post_survey['primary_answer'].sample().index[0]]).keys()
    df_post_survey.primary_answer = df_post_survey.primary_answer.apply(lambda s: s.replace('@email', '')) # someone's reply is messing up the string splitting
    df_post_survey['primary_answer'] = df_post_survey['primary_answer'].apply(likert_series_to_json, keys=keys)
    df_split = df_post_survey['primary_answer'].apply(lambda x: pd.Series(x.split('@')))
    split_questions_into_columns(df_post_survey, df_split, len(df_post_survey.keys()), keys)

    ############ Add string-labeled entries for plotting ############

    with open('dfs.pickle', 'wb') as f:
        pickle.dump((df_training_exp1, df_training_exp2, df_testing, df_testing_sandbox, df_training_survey_exp1, df_training_survey_exp2, df_post_survey), f)

'''
 END: TABLE DEFINITIONS
'''

''' START: HELPER FNS '''

def id_to_condition(id):
    return CONDITION_MAPPING[int(id)]

def id_to_confidence(id):
    return CONFIDENCE_MAPPING[int(id)]

def id_to_confidence_numbered(id):
    return CONFIDENCE_NUMBERED_MAPPING[int(id)]

def id_to_scaffolding(id):
    return SCAFFOLDING_MAPPING[int(id)]

def id_to_opt_visuals(id):
    return OPT_VISUALS_MAPPING[int(id)]

def id_to_test_difficulty(id):
    return TEST_DIFFICULTY_MAPPING[int(id)]

def id_to_test_difficulty_numbered(id):
    return TEST_DIFFICULTY_NUMBERED_MAPPING[int(id)]

def id_to_informativeness(id):
    return INFORMATIVENESS_MAPPING[int(id)]

def id_to_informativeness_numbered(id):
    return INFORMATIVENESS_NUMBERED_MAPPING[int(id)]

def id_to_mental_effort(id):
    return MENTAL_EFFORT_MAPPING[int(id)]

def id_to_mental_effort_numbered(id):
    return MENTAL_EFFORT_NUMBERED_MAPPING[int(id)]

def id_to_puzzlement(id):
    return PUZZLEMENT_MAPPING[int(id)]

def id_to_puzzlement_numbered(id):
    return PUZZLEMENT_NUMBERED_MAPPING[int(id)]

def id_to_scaffolding(id):
    return SCAFFOLDING_MAPPING[int(id)]

def id_to_experiment(id):
    if id in [0, 1, 2]:
        return 1
    else:
        return 2

def obtain_label(iter_vars, key):
    label = ''
    for j, var in enumerate(iter_vars):
        if j > 0: label += ' + '
        if var == 'scaffolding':
            label += id_to_scaffolding(key[j])
        elif var == 'opt_visuals':
            label += id_to_opt_visuals(key[j])
        elif var == 'test_difficulty':
            label += id_to_test_difficulty(key[j])
        else:
            label += str(key[j])
    return label

def likert_series_to_json(likert, keys=[]):
    if '@' in likert:
        return likert
    parsed = json.loads(likert)
    ret = ''
    for idx, key in enumerate(keys):
        ret += str(parsed[key])
        if idx != len(parsed.keys()) - 1:
            ret += "@"
    return ret

def likert_to_int(likert, idx):
    if '@' in likert:
        return likert
    parsed = json.loads(likert)[idx]
    return int(parsed)

def count_likert_responses(df, x_var, y_var):
    df_counting = pd.DataFrame(columns=[x_var, y_var, 'Count'])

    for x in df[x_var].unique():
        for y in df[y_var].unique():
            df_counting = df_counting.append({x_var: x, y_var: y, 'Count': len(df[(df[x_var] == x) &
                            (df[y_var] == y)].index)}, ignore_index=True)

    return df_counting

def separate_counterbalance(joint_counter_balance_list):
    '''
    Separate the joint counterbalance into counterbalance and train_test_set
    :return:
    '''
    counterbalance_list = []
    train_test_set_list = []

    for joint_counter_balance in joint_counter_balance_list:
        if joint_counter_balance <= 5:
            train_test_set_list.append(0)
            counterbalance_list.append(joint_counter_balance)
        elif joint_counter_balance >= 12:
            train_test_set_list.append(2)
            counterbalance_list.append(joint_counter_balance - 12)
        else:
            train_test_set_list.append(1)
            counterbalance_list.append(joint_counter_balance - 6)

    return counterbalance_list, train_test_set_list

def join_counterbalance(n_counterbalances, counterbalance_list, train_test_set_list):
    '''
    Join counterbalance and train_test_set into joint counterbalance (for Psiturk)
    :return:
    '''
    joint_counterbalance_list = []
    for j, counterbalance in enumerate(counterbalance_list):
        joint_counterbalance_list.append(train_test_set_list[j] * n_counterbalances + counterbalance)

    return joint_counterbalance_list

def obtain_remaining_joint_conditions():
    '''
    Return the joint conditions (condition, counterbalance, train_test_set) that have not been covered yet
    '''
    print("\n========== CONDITION INFORMATION==========")

    n_conditions = 9
    n_counterbalances = 6
    n_train_test_sets = 3

    condition_list = df_post_survey.condition.to_list()
    counterbalance_list = df_post_survey.counterbalance.to_list()
    train_test_set_list = df_post_survey.train_test_set.to_list()

    # functions that could be useful if setting the condition and counterbalancing through PsiTurk's system
    # joint_counterbalance_list = join_counterbalance(n_counterbalances, counterbalance_list, train_test_set_list)
    # counterbalance_list_recovered, train_test_set_list_recovered = separate_counterbalance(joint_counterbalance_list)

    completed_joint_conditions = []
    for j, condition in enumerate(condition_list):
        completed_joint_conditions.append([condition, counterbalance_list[j], train_test_set_list[j]])

    all_possible_joint_conditions = []
    remaining_joint_conditions = []
    for i in range(n_conditions):
        for j in range(n_counterbalances):
            for k in range(n_train_test_sets):
                proposed_joint_condition = [i, j, k]
                all_possible_joint_conditions.append(proposed_joint_condition)
                if proposed_joint_condition not in completed_joint_conditions:
                    remaining_joint_conditions.append(proposed_joint_condition)

    print("# unique joint conditions: {}".format(len(all_possible_joint_conditions)))
    print("Completed unique joint conditions: {}".format(len(completed_joint_conditions)))
    print("Remaining unique joint conditions: {}".format(len(remaining_joint_conditions)))

    return remaining_joint_conditions

def validate_submissions():
    uniqueids = []

    # reading csv file
    with open('prolific.csv', 'r') as csvfile:
        # creating a csv reader object
        csvreader = csv.reader(csvfile)

        # extracting each data row one by one
        for row in csvreader:
            uniqueids.append(row[1])

    # first entry is the column title
    uniqueids = uniqueids[1:]

    for j, uniqueid in enumerate(uniqueids):
        print("ID number: {}".format(j))
        print(uniqueid)

        if len(df_post_survey[df_post_survey.uniqueid == uniqueid].index) == 0:
            if len(df_testing_sandbox[df_testing_sandbox.uniqueid == uniqueid.index] == 0):
                print("{} doesn't have any data".format(uniqueid))
            else:
                print("{} didn't make it to the end".format(uniqueid))

        else:
            condition = df_post_survey[df_post_survey.uniqueid == uniqueid].condition.values[0]

            if condition in [0, 1, 2]:
                print(df_training_exp1[df_training_exp1.uniqueid == uniqueid].n_video_loops)
                print(df_training_survey_exp1[df_training_survey_exp1.uniqueid == uniqueid].primary_answer)
                # print(df_testing_exp1[df_testing_exp1.uniqueid == uniqueid].scaled_human_reward)
            else:
                print(df_training_exp2[df_training_exp2.uniqueid == uniqueid].n_video_loops)
                print(df_training_survey_exp2[df_training_survey_exp2.uniqueid == uniqueid].primary_answer)
                # print(df_testing_exp2[df_testing_exp2.uniqueid == uniqueid].scaled_human_reward)
            print(df_testing[df_testing.uniqueid == uniqueid].scaled_human_reward)
        print(df_post_survey[df_post_survey.uniqueid == uniqueid])  # make sure they completed the full survey
        print("\n \n \n \n \n \n \n \n")


def analyze_H2_H3_objective(df_training, df_testing, between_var, domain_specific=False):
    # obtain_n_training_video_loops(df_training, [between_var])
    obtain_test_demonstration_performance(df_testing, [between_var])
    # obtain_test_demonstration_rt(df_testing, [between_var])

    print("\n========== ANOVA: TEST DEMONSTRATION PERFORMANCE ==========")
    if domain_specific:
        aov = pg.mixed_anova(dv='scaled_human_reward', within='test_difficulty', subject='uniqueid',
                             between=between_var, data=df_testing)
    else:
        aov = pg.mixed_anova(dv='scaled_human_reward', within='domain', subject='uniqueid', between=between_var,
                             data=df_testing)
    print(aov)
    print(aov['p-unc'])
    print("\n========== TUKEY: TEST DEMONSTRATION PERFORMANCE ==========")
    pt = pg.pairwise_tukey(dv='scaled_human_reward', between=between_var, data=df_testing)
    print(pt)

''' END: HELPER FNS '''

'''
 START: DESCRIPTIVE STATISTICS
'''
def obtain_n_training_video_loops(df_training, iter_vars):
    '''
    iter_vars: columns of interest
    Number of times looped through the training video
    '''
    print("\n========== TRAINING VIDEO LOOPS ==========")

    # all unique values of the columns of interest (e.g. the various possible domains)
    iter_vals = []
    for iter_var in iter_vars:
        iter_vals.append(df_training[iter_var].unique())

    iter_keys = list(itertools.product(*iter_vals))

    for key in iter_keys:
        label = obtain_label(iter_vars, key)
        print(label)

        individual_selection = [df_training[iter_vars[k]] == key[k] for k in range(len(iter_vars))]
        joint_selection = individual_selection[0]
        for individual in range(1, len(individual_selection)):
            joint_selection = joint_selection & individual_selection[individual]
        print("Mean: {}".format(np.mean(df_training.loc[joint_selection].n_video_loops)))
        print("Std: {}".format(np.std(df_training.loc[joint_selection].n_video_loops)))


def obtain_test_demonstration_performance(df_testing, iter_vars):
    '''
    Testing performance (human's reward scaled by the optimal reward)
    '''
    print("\n========== TEST DEMONSTRATION PERFORMANCE ==========")

    # all unique values of the columns of interest (e.g. the various possible domains)
    iter_vals = []
    for iter_var in iter_vars:
        iter_vals.append(df_testing[iter_var].unique())

    iter_keys = list(itertools.product(*iter_vals))

    for key in iter_keys:
        label = obtain_label(iter_vars, key)
        print(label)

        individual_selection = [df_testing[iter_vars[k]] == key[k] for k in range(len(iter_vars))]
        joint_selection = individual_selection[0]
        for individual in range(1, len(individual_selection)):
            joint_selection = joint_selection & individual_selection[individual]
        print("Mean: {}".format(np.mean(df_testing.loc[joint_selection].scaled_human_reward)))
        print("Std: {}".format(np.std(df_testing.loc[joint_selection].scaled_human_reward)))

def obtain_test_demonstration_rt(df_testing, iter_vars, use_simulation_rt=False):
    '''
    Time take to provide the test demonstration
    '''
    print("\n========== TEST DEMONSTRATION RT ==========")

    # all unique values of the columns of interest (e.g. the various possible domains)
    iter_vals = []
    for iter_var in iter_vars:
        iter_vals.append(df_testing[iter_var].unique())

    iter_keys = list(itertools.product(*iter_vals))

    for key in iter_keys:
        label = obtain_label(iter_vars, key)
        print(label)

        individual_selection = [df_testing[iter_vars[k]] == key[k] for k in range(len(iter_vars))]
        joint_selection = individual_selection[0]
        for individual in range(1, len(individual_selection)):
            joint_selection = joint_selection & individual_selection[individual]
        if use_simulation_rt:
            print("Mean: {}".format(np.mean(df_testing.loc[joint_selection].normalized_simulation_rt)))
            print("Std: {}".format(np.std(df_testing.loc[joint_selection].normalized_simulation_rt)))
        else:
            print("Mean: {}".format(np.mean(df_testing.loc[joint_selection].normalized_primary_rt)))
            print("Std: {}".format(np.std(df_testing.loc[joint_selection].normalized_primary_rt)))

'''
 END: DESCRIPTIVE STATISTICS
'''

'''
 START: INFERENTIAL STATISTICS
'''

'''
 END: INFERENTIAL STATISTICS
'''

'''
 START: USEFUL PRINTS
'''

def print_demographics(flagged_ids=None):
    print("\n========== DEMOGRAPHIC INFORMATION ==========")
    participants = df_post_survey.uniqueid.unique()

    if flagged_ids is not None:
        print("Flagged " + str(len(flagged_ids)) + " total.")
    print("Number of participants: " + str(len(participants)))

    print("Conditions Represented: ")
    conds = dict()
    for participant in participants:
        participant_info = df_post_survey[df_post_survey['uniqueid'] == participant]
        if not participant_info.empty:
            # curr_cond = (participant_info['condition'].iloc[0], participant_info['counterbalance'].iloc[0], participant_info['train_test_set'].iloc[0])
            # curr_cond = (participant_info['condition'].iloc[0], participant_info['counterbalance'].iloc[0])
            curr_cond = (participant_info['condition'].iloc[0])
            if curr_cond not in conds:
                conds[curr_cond] = 1
            else:
                conds[curr_cond] += 1
        else:
            print("No post study data recorded for " + participant)

    for cond in sorted(conds):
        if conds[cond] > 0:
            print(" Condition: " + str(cond) + " : " + str(conds[cond]))

    print("Ages (description)")
    ages = pd.to_numeric(df_post_survey.Q1)
    print(ages.describe())
    # print("Max: " + str(ages.max()))
    # print("Min: " + str(ages.min()))
    # print("Mean: " + str(ages.mean()))
    # print("SE: " + str(ages.sem()))
    print("Genders: ")
    gender_vals = [0, 0, 0, 0]
    mapping = {0: 'Male', 1: 'Female', 2: 'Non-binary', 3: 'Prefer not to disclose'}
    answers = df_post_survey.Q2
    for answer in answers:
        gender_vals[int(answer)] += 1

    for idx, num in enumerate(gender_vals):
        print(mapping[idx] + " : " + str(num) + "(" + str(num / (np.sum(gender_vals))) + "%)")

def print_feedback():
    print("\n========== GENERAL STUDY FEEDBACK ==========")
    for feedback in df_post_survey.Q0:
        print(feedback)
        print("--")

'''
 END: USEFUL PRINTS
'''

'''
 START: PLOTTING
'''

def plot_performance_bar_charts(df=None, x_var=None, x_labels=None, x_title=None, y_var=None, y_title=None, title=None, show_plot=False, save_file=None):
    d0 = alt.Chart(df, title=title).mark_bar().encode(
        x=alt.X(x_var, sort=x_labels, title=x_title),
        y=alt.Y(y_var, aggregate='mean', title=y_title),
        color=alt.Color(x_var, sort=x_labels, scale=alt.Scale(scheme='blues'), legend=None)
    )
    final_chart = d0

    if show_plot:
        final_chart.show()
    if save_file is not None:
        save(d0, save_file, method='selenium', webdriver=driver)

def plot_grouped_performance_bar_charts(df=None, x_var=None, x_labels=None, x_title=None, y_var=None, y_title=None, col_var=None, col_sort=None, plot_title=None, legend_title=None, show_plot=False, save_file=None, scheme='blues'):
    axisLabelFontSize = 15

    d0 = alt.Chart(df).mark_bar().encode(
        x=alt.X(x_var, sort=x_labels, title=None, axis=alt.Axis(labels=False)),
        y=alt.Y(y_var, aggregate='mean', axis=alt.Axis(title=y_title, titleFontSize=14)),
        color=alt.Color(x_var, sort=x_labels,
                        scale=alt.Scale(scheme=scheme),
                        legend=alt.Legend(title=legend_title))
    ).properties(
    width=100,
    height=200
    )
    d0 = alt.layer(d0, data=df).facet(
        column=alt.Column(col_var, sort=col_sort, title='Test Difficulty', header=alt.Header(titleOrient='bottom', labelOrient='bottom', labelFontSize=axisLabelFontSize, titleFontSize=axisLabelFontSize)),
        title=alt.TitleParams(plot_title, anchor='middle')
    )
    if show_plot:
        d0.show()
    if save_file is not None:
        save(d0, save_file, method='selenium', webdriver=driver)


def plot_subjective_bar_charts(df, x_label, y, y_label, y_labels, legend_title=None, show_plot=False, save_file=None):
    titleFontSize = 15
    legendFontSize = 13
    legendTitleFontSize = 20 # can't get this to work

    d0 = alt.Chart(df).mark_bar().encode(
        x=alt.X('count(Q0):Q', axis=alt.Axis(title=x_label, titleFontSize=titleFontSize)),
        y=alt.Y(y, axis=alt.Axis(title=y_label, labelFontSize=titleFontSize, titleFontSize=titleFontSize), sort=y_labels),
        color=alt.Color('Q0_string:N', scale=alt.Scale(scheme='greens'),
                        legend=alt.Legend(title=legend_title, orient='top', labelFontSize=legendFontSize, titleFontWeight='bold', titleFontSize=legendTitleFontSize), sort=INFORMATIVENESS_LABELS),
        order=alt.Order('Q0:O', sort='ascending'),
    ).properties(
        title='Informativeness',
    )
    d1 = alt.Chart(df).mark_bar().encode(
        x=alt.X('count(Q1):Q', axis=alt.Axis(title=x_label, titleFontSize=titleFontSize)),
        y=alt.Y(y, axis=alt.Axis(title=None,  labels=False), sort=y_labels),
        color=alt.Color('Q1_string:N', scale=alt.Scale(scheme='oranges'),
                        legend=alt.Legend(title=legend_title, orient='top', labelFontSize=legendFontSize), sort=MENTAL_EFFORT_LABELS),
        order=alt.Order('Q1:O', sort='ascending')
    ).properties(
        title='Mental effort',
    )
    d2 = alt.Chart(df).mark_bar().encode(
        x=alt.X('count(Q2):Q', axis=alt.Axis(title=x_label, titleFontSize=titleFontSize)),
        y=alt.Y(y, axis=alt.Axis(title=None, labels=False), sort=y_labels),
        color=alt.Color('Q2_string:N', scale=alt.Scale(scheme='purples'),
                        legend=alt.Legend(title=legend_title, orient='top', labelFontSize=legendFontSize), sort=PUZZLEMENT_LABELS),
        order=alt.Order('Q2:O', sort='ascending')
    ).properties(
        title='Puzzlement',
    )
    final_chart = alt.hconcat(d0, d1, d2).resolve_scale(color='independent')

    if show_plot:
        final_chart.show()
    if save_file is not None:
        save(final_chart, save_file, method='selenium', webdriver=driver)


def plot_confidence_bar_charts(df, x_label, y, y_label, y_labels, legend_title=None, show_plot=False, save_file=None):
    d0 = alt.Chart(df).mark_bar().encode(
        x=alt.X('count(likert_response):Q', axis=alt.Axis(title=x_label)),
        y=alt.Y(y, axis=alt.Axis(title=y_label), sort=y_labels),
        color=alt.Color('likert_response_string:N', scale=alt.Scale(scheme='tealblues'),
                        legend=alt.Legend(title=legend_title, orient='top'), sort=CONFIDENCE_LABELS),
        order=alt.Order('likert_response:O', sort='ascending')
    ).properties(
        title='Confidence in Test Demonstration',
    )
    if show_plot:
        d0.show()
    if save_file is not None:
        save(d0, save_file, method='selenium', webdriver=driver)


def plot_spearman_corr(data_scatter=None, data_regression=None, x_var=None, y_var_scatter=None, y_var_reg=None, r=None, title=None, xlabel=None, ylabel=None, xticklabels=None, yticklabels=None, show_plot=False, save_file=None):
    plt.rcParams.update({'font.size': 14})
    plt.figure(figsize=(50,50)) # todo: not working. I think this is creating a separate figure beforehand
    sns.relplot(x=x_var, y=y_var_scatter, size="Count",
                     sizes=(100, 3000), alpha=1, palette="muted", data=data_scatter)
    plt.xlim(-0.25, 2.25)
    d0 = sns.regplot(x=x_var, y=y_var_reg, data=data_regression)
    d0.annotate("r = {:.2f} ".format(r),
                xy=(1.5, 3))
    d0.set(xticks=range(len(data_scatter[x_var].unique())))
    d0.set(xticklabels=xticklabels)
    d0.set(yticks=range(len(data_scatter[y_var_scatter].unique())))
    d0.set(yticklabels=yticklabels)
    plt.ylabel(ylabel)
    plt.xlabel(xlabel)
    plt.tight_layout()
    plt.grid(True, linestyle='--', linewidth=0.5)
    plt.title(title)

    if show_plot:
        plt.show()
    if save_file is not None:
        plt.savefig(save_file, dpi=200, transparent=True)


'''
 END: USEFUL PRINTS
'''

if __name__ == '__main__':
    remote = False
    show_plot = False

    if remote:
        # a) pulling remote data and storing them locally
        data = get_remote_data()
        print("Got data")
        table_setup(data)
        print("Set up tables")
        flagged_ids = flag_ids()
        edit_tables(data, flagged_ids)

        # ensuring all conditions are covered; obtain a list of conditions that have are yet to be fulfilled
        # remaining_joint_conditions = obtain_remaining_joint_conditions()
        # print(remaining_joint_conditions)

        # print demographics and also see if any joint conditions have been doubled up on
        print_demographics(flagged_ids)

        # print general study feedback
        # print_feedback()

    else:
        # b) working with and analyzing local data
        get_local_data()
        # print_demographics()

        # validate_submissions()

        # plotting labels
        subjective_x_axis = 'Number of Responses'
        information_y_axis_label = 'Information Level'
        scaffolding_y_axis_label = 'Scaffolding'
        opt_visuals_y_axis_label = 'Optimized Visuals'
        test_difficulty_y_axis_label = 'Test difficulty'
        human_performance_title = 'Percentage of optimal test responses'

        # average over domain
        df_training_survey_avg_exp1 = pd.DataFrame(columns=['uniqueid', 'scaffolding', 'Q0', 'Q1', 'Q2'])
        for uniqueid in np.unique(df_training_survey_exp1.uniqueid):
            Q0_avg = np.median(df_training_survey_exp1[df_training_survey_exp1.uniqueid == uniqueid].Q0)
            Q1_avg = np.median(df_training_survey_exp1[df_training_survey_exp1.uniqueid == uniqueid].Q1)
            Q2_avg = np.median(df_training_survey_exp1[df_training_survey_exp1.uniqueid == uniqueid].Q2)
            scaffolding = df_training_survey_exp1[df_training_survey_exp1.uniqueid == uniqueid].scaffolding.values[0]
            df_training_survey_avg_exp1 = df_training_survey_avg_exp1.append({'uniqueid': uniqueid, 'scaffolding': scaffolding,
                                                'Q0': Q0_avg, 'Q1': Q1_avg, 'Q2': Q2_avg}, ignore_index=True)
        df_training_survey_avg_exp1['scaffolding_string'] = df_training_survey_avg_exp1['scaffolding'].apply(id_to_scaffolding)
        # add string-labeled entries for plotting
        df_training_survey_avg_exp1['Q0_string'] = df_training_survey_avg_exp1['Q0'].apply(id_to_informativeness)
        df_training_survey_avg_exp1['Q1_string'] = df_training_survey_avg_exp1['Q1'].apply(id_to_mental_effort)
        df_training_survey_avg_exp1['Q2_string'] = df_training_survey_avg_exp1['Q2'].apply(id_to_puzzlement)

        df_training_survey_avg_exp2 = pd.DataFrame(columns=['uniqueid', 'scaffolding', 'opt_visuals', 'Q0', 'Q1', 'Q2'])
        for uniqueid in np.unique(df_training_survey_exp2.uniqueid):
            Q0_avg = np.median(df_training_survey_exp2[df_training_survey_exp2.uniqueid == uniqueid].Q0)
            Q1_avg = np.median(df_training_survey_exp2[df_training_survey_exp2.uniqueid == uniqueid].Q1)
            Q2_avg = np.median(df_training_survey_exp2[df_training_survey_exp2.uniqueid == uniqueid].Q2)
            scaffolding = df_training_survey_exp2[df_training_survey_exp2.uniqueid == uniqueid].scaffolding.values[0]
            opt_visuals = df_training_survey_exp2[df_training_survey_exp2.uniqueid == uniqueid].opt_visuals.values[0]
            df_training_survey_avg_exp2 = df_training_survey_avg_exp2.append({'uniqueid': uniqueid, 'scaffolding': scaffolding,
                                                'opt_visuals': opt_visuals, 'Q0': Q0_avg, 'Q1': Q1_avg, 'Q2': Q2_avg}, ignore_index=True)

        df_training_survey_avg_exp2['opt_visuals_string'] = df_training_survey_avg_exp2['opt_visuals'].apply(id_to_opt_visuals)
        # add string-labeled entries for plotting
        df_training_survey_avg_exp2['Q0_string'] = df_training_survey_avg_exp2['Q0'].apply(id_to_informativeness)
        df_training_survey_avg_exp2['Q1_string'] = df_training_survey_avg_exp2['Q1'].apply(id_to_mental_effort)
        df_training_survey_avg_exp2['Q2_string'] = df_training_survey_avg_exp2['Q2'].apply(id_to_puzzlement)


        df_testing['test_difficulty_string'] = df_testing['test_difficulty'].apply(id_to_test_difficulty)
        df_testing['test_difficulty_numbered_string'] = df_testing['test_difficulty'].apply(
            id_to_test_difficulty_numbered)

        df_testing_avg = pd.DataFrame(columns=['uniqueid', 'condition', 'scaffolding', 'opt_visuals', 'test_difficulty',
                                               'scaled_human_reward', 'likert_response'])
        for uniqueid in np.unique(df_testing.uniqueid):
            for test_difficulty in np.unique(df_testing.test_difficulty):
                scaled_human_reward_avg = np.average(df_testing[(df_testing.uniqueid == uniqueid) & (df_testing.test_difficulty == test_difficulty)].scaled_human_reward)
                likert_response_avg = np.median(df_testing[(df_testing.uniqueid == uniqueid) & (df_testing.test_difficulty == test_difficulty)].likert_response)
                scaffolding = df_testing[(df_testing.uniqueid == uniqueid) & (df_testing.test_difficulty == test_difficulty)].scaffolding.values[0]
                opt_visuals = df_testing[(df_testing.uniqueid == uniqueid) & (df_testing.test_difficulty == test_difficulty)].opt_visuals.values[0]
                condition = df_testing[(df_testing.uniqueid == uniqueid) & (df_testing.test_difficulty == test_difficulty)].condition.values[0]
                df_testing_avg = df_testing_avg.append({'uniqueid': uniqueid, 'condition': condition, 'scaffolding': scaffolding, 'opt_visuals': opt_visuals,
                                                        'test_difficulty': test_difficulty, 'scaled_human_reward': scaled_human_reward_avg, 'likert_response': likert_response_avg}, ignore_index=True)
        # add string-labeled entries for plotting
        df_testing_avg['condition_string'] = df_testing_avg['condition'].apply(id_to_condition)
        df_testing_avg['scaffolding_string'] = df_testing_avg['scaffolding'].apply(id_to_scaffolding)
        df_testing_avg['opt_visuals_string'] = df_testing_avg['opt_visuals'].apply(id_to_opt_visuals)
        df_testing_avg['likert_response_string'] = df_testing_avg['likert_response'].apply(id_to_confidence)
        df_testing_avg['likert_response_numbered_string'] = df_testing_avg['likert_response'].apply(
            id_to_confidence_numbered)
        df_testing_avg['test_difficulty_string'] = df_testing_avg['test_difficulty'].apply(id_to_test_difficulty)
        df_testing_avg['test_difficulty_numbered_string'] = df_testing_avg['test_difficulty'].apply(
            id_to_test_difficulty_numbered)


        df_training_avg_exp1 = pd.DataFrame(columns=['uniqueid', 'scaffolding', 'n_video_loops'])
        for uniqueid in np.unique(df_training_exp1.uniqueid):
            n_video_loops_avg = np.average(df_training_exp1[df_training_exp1.uniqueid == uniqueid].n_video_loops)
            scaffolding = df_training_exp1[(df_training_exp1.uniqueid == uniqueid)].scaffolding.values[0]
            df_training_avg_exp1 = df_training_avg_exp1.append({'uniqueid': uniqueid, 'scaffolding': scaffolding, 'n_video_loops': n_video_loops_avg}, ignore_index=True)

        df_training_avg_exp2 = pd.DataFrame(columns=['uniqueid', 'scaffolding', 'opt_visuals', 'n_video_loops'])
        for uniqueid in np.unique(df_training_exp2.uniqueid):
            n_video_loops_avg = np.average(df_training_exp2[df_training_exp2.uniqueid == uniqueid].n_video_loops)
            scaffolding = df_training_exp2[(df_training_exp2.uniqueid == uniqueid)].scaffolding.values[0]
            opt_visuals = df_training_exp2[(df_training_exp2.uniqueid == uniqueid)].opt_visuals.values[0]
            df_training_avg_exp2 = df_training_avg_exp2.append({'uniqueid': uniqueid, 'scaffolding': scaffolding, 'opt_visuals': opt_visuals, 'n_video_loops': n_video_loops_avg}, ignore_index=True)


        # separate df_testing into experiment 1 and experiment 2
        df_testing_exp1 = df_testing[df_testing.condition.isin([0, 1, 2])]
        df_testing_exp2 = df_testing[df_testing.condition.isin([3, 4, 5, 6, 7, 8])]

        df_testing_avg_exp1 = df_testing_avg[df_testing_avg.condition.isin([0, 1, 2])]
        df_testing_avg_exp2 = df_testing_avg[df_testing_avg.condition.isin([3, 4, 5, 6, 7, 8])]

        # ######### data analysis #########
        #
        # print("\n==================== H1 ====================")
        # print("\n========== ANOVA: TEST DEMONSTRATION PERFORMANCE ==========")
        # aov = pg.rm_anova(dv='scaled_human_reward', within=['test_difficulty'], subject='uniqueid',
        #                   data=df_testing, correction=True)
        #
        # if ('p-GG-corr' in aov and aov['p-GG-corr'].iloc[0] < alpha) or (
        #         'p-GG-corr' not in aov and aov['p-unc'].iloc[0] < alpha):
        #
        #     print('Reject H0: different distributions. Perform post-hoc Tukey HSD.')
        #     try:
        #         print("Corrected p-val: {}, DOF effect: {}, DOF error: {}, F: {}".format(aov['p-GG-corr'][0], aov['ddof1'][0],
        #                                                                        aov['ddof2'][0], aov['F'][0]))
        #     except:
        #         print("Uncorrected p-val: {}, DOF effect: {}, DOF error: {}, F: {}".format(aov['p-unc'][0], aov['ddof1'][0],
        #                                                                        aov['ddof2'][0], aov['F'][0]))
        #
        #     print("\n========== TUKEY: TEST DEMONSTRATION PERFORMANCE ==========")
        #     pt = pg.pairwise_tukey(dv='scaled_human_reward', between='test_difficulty', data=df_testing_avg)
        #     print(pt)
        #
        #
        #     # plot percentage of optimal responses
        #     # plot_performance_bar_charts(df=df_testing_avg, x_var='test_difficulty_string:N', x_labels=TEST_DIFFICULTY_LABELS, x_title='Test Difficulty', y_var='scaled_human_reward:Q', y_title=human_performance_title, title='Test Performance based on Test Difficulty', show_plot=show_plot, save_file='H1_objective.png')
        # else:
        #     print('Failed to reject H0.')
        #
        # print("\n========== SPEARMAN CORRELATION: SUBJECTIVE  ==========")
        # # subjective
        # corr = pg.corr(df_testing_avg.test_difficulty, df_testing_avg.likert_response, method="spearman")
        # if corr['p-val'][0] < alpha:
        #     print('Reject H0: Correlation between test difficulty and confidence.')
        #     print(corr)
        #
        # plot raw confidence data
        # plot_confidence_bar_charts(df_testing_avg, subjective_x_axis, 'test_difficulty_string:N', test_difficulty_y_axis_label, list(reversed(TEST_DIFFICULTY_LABELS)), show_plot=show_plot, save_file='H1_subjective_raw.png')
        #
        # # plot spearman correlation of confidence data in scatter plot
        # df_confidence_counting = count_likert_responses(df_testing_avg, 'test_difficulty', 'likert_response')
        # plot_spearman_corr(data_scatter=df_confidence_counting, data_regression=df_testing, x_var='test_difficulty', y_var_scatter='likert_response', y_var_reg='likert_response', r=10, title='Confidence', xlabel='Test Difficulty', ylabel='Confidence', xticklabels=TEST_DIFFICULTY_NUMBERED_LABELS, yticklabels=CONFIDENCE_NUMBERED_LABELS, show_plot=show_plot, save_file='H1_subjective_spearman.png')

        #############################################################################################################
        #
        #
        # print("\n==================== H2 ====================")
        # # descriptive statistics
        # data = df_testing_avg_exp1[(df_testing_avg_exp1.scaffolding == 0)].scaled_human_reward
        # print(np.mean(data))
        # print(np.std(data))
        # data = df_testing_avg_exp1[(df_testing_avg_exp1.scaffolding == 1)].scaled_human_reward
        # print(np.mean(data))
        # print(np.std(data))
        # data = df_testing_avg_exp1[(df_testing_avg_exp1.scaffolding == 2)].scaled_human_reward
        # print(np.mean(data))
        # print(np.std(data))

        # print("\n========== ANOVA: TEST DEMONSTRATION PERFORMANCE ==========")
        # aov = pg.mixed_anova(dv='scaled_human_reward', within='test_difficulty', subject='uniqueid', between='scaffolding',
        #                data=df_testing_avg_exp1, correction=True)
        #
        # print("p-val: {}, DOF effect: {}, DOF error: {}, F: {}".format(aov['p-unc'].values, aov['DF1'].values, aov['DF2'].values, aov['F'].values))
        #
        # print(aov)
        # print(aov['p-unc'])
        # print(aov['p-GG-corr'])
        #
        # # plot percentage of optimal responses
        # # plot_performance_bar_charts(df=df_testing_avg_exp1, x_var='scaffolding_string:N', x_labels=SCAFFOLDING_LABELS, x_title='Information Class', y_var='scaled_human_reward:Q', y_title=human_performance_title, title='Experiment 1', show_plot=show_plot, save_file='H2_objective.png')
        #
        # # there aren't any interaction effects but visualizing them just in case
        # # plot_grouped_performance_bar_charts(df=df_testing_avg_exp1, x_var='scaffolding_string:N', x_labels=SCAFFOLDING_LABELS, x_title='Test difficulty', y_var='scaled_human_reward:Q', y_title=human_performance_title, col_var='test_difficulty_string:N', col_sort=TEST_DIFFICULTY_LABELS, plot_title='Interaction effect between Information Class and Test Difficulty', legend_title='Information class', show_plot=show_plot, save_file='H2_objective_interaction.png')
        #
        #
        # # subjective
        # print(pg.corr(df_training_survey_avg_exp1.scaffolding, df_training_survey_avg_exp1.Q0, method="spearman"))
        # print(pg.corr(df_training_survey_avg_exp1.scaffolding, df_training_survey_avg_exp1.Q1, method="spearman"))
        # print(pg.corr(df_training_survey_avg_exp1.scaffolding, df_training_survey_avg_exp1.Q2, method="spearman"))

        # # plot subjective bar chart
        # plot_subjective_bar_charts(df_training_survey_avg_exp1, subjective_x_axis, 'scaffolding_string:N', information_y_axis_label, list(reversed(SCAFFOLDING_LABELS)), show_plot=show_plot, save_file='H2_subjective_raw.png')
        #
        # # plot spearman correlation
        # df_Q0_counting = count_likert_responses(df_training_survey_avg_exp1, 'scaffolding', 'Q0')
        # plot_spearman_corr(data_scatter=df_Q0_counting, data_regression=df_training_survey_exp1, x_var='scaffolding', y_var_scatter='Q0', y_var_reg='Q0', r=10, title='Informativeness', xlabel='Training Information Level', ylabel='Likert Response', xticklabels=TEST_DIFFICULTY_NUMBERED_LABELS, yticklabels=INFORMATIVENESS_NUMBERED_LABELS, show_plot=show_plot, save_file='H2_informativeness_spearman.png')
        # df_Q1_counting = count_likert_responses(df_training_survey_avg_exp1, 'scaffolding', 'Q1')
        # plot_spearman_corr(data_scatter=df_Q1_counting, data_regression=df_training_survey_exp1, x_var='scaffolding', y_var_scatter='Q1', y_var_reg='Q1', r=10, title='Mental Effort', xlabel='Training Information Level', ylabel='Likert Response', xticklabels=TEST_DIFFICULTY_NUMBERED_LABELS, yticklabels=MENTAL_EFFORT_NUMBERED_LABELS, show_plot=show_plot, save_file='H2_mental_effort_spearman.png')
        # df_Q2_counting = count_likert_responses(df_training_survey_avg_exp1, 'scaffolding', 'Q2')
        # plot_spearman_corr(data_scatter=df_Q2_counting, data_regression=df_training_survey_exp1, x_var='scaffolding', y_var_scatter='Q2', y_var_reg='Q2', r=10, title='Puzzlement', xlabel='Training Information Level', ylabel='Likert Response', xticklabels=TEST_DIFFICULTY_NUMBERED_LABELS, yticklabels=PUZZLEMENT_NUMBERED_LABELS, show_plot=show_plot, save_file='H2_puzzlement_spearman.png')
        #
        #
        #############################################################################################################
        #
        # print("\n==================== H3 ====================")
        # # descriptive statistics
        # data = df_testing_exp2[(df_testing_exp2.scaffolding == 3)].scaled_human_reward
        # print(np.mean(data))
        # print(np.std(data))
        # data = df_testing_exp2[(df_testing_exp2.scaffolding == 4)].scaled_human_reward
        # print(np.mean(data))
        # print(np.std(data))
        # data = df_testing_exp2[(df_testing_exp2.scaffolding == 5)].scaled_human_reward
        # print(np.mean(data))
        # print(np.std(data))

        # data = df_testing_avg_exp2
        # aov = pg.mixed_anova(dv='scaled_human_reward', within='test_difficulty', subject='uniqueid',
        #                      between='scaffolding', data=data, correction=True)
        # print("p-val: {}, DOF effect: {}, DOF error: {}, F: {}".format(aov['p-unc'].values, aov['DF1'].values, aov['DF2'].values, aov['F'].values))
        # print(aov)
        # print(aov['p-unc'])
        # print(aov['p-GG-corr'])
        #
        # exploring interaction effects
        # print("\n========== TUKEY: INTERACTION BETWEEN SCAFFOLDING AND TEST DIFFICULTY ==========")
        # data = df_testing_avg_exp2[(df_testing_avg_exp2.test_difficulty == 0)]
        # pt = pg.pairwise_tukey(dv='scaled_human_reward', between='scaffolding', data=data)
        # print(pt)
        # data = df_testing_avg_exp2[(df_testing_avg_exp2.test_difficulty == 1)]
        # pt = pg.pairwise_tukey(dv='scaled_human_reward', between='scaffolding', data=data)
        # print(pt)
        # # statistically significant
        # data = df_testing_avg_exp2[(df_testing_avg_exp2.test_difficulty == 2)]
        # pt = pg.pairwise_tukey(dv='scaled_human_reward', between='scaffolding', data=data)
        # print(pt)

        # # plot global performance
        # plot_performance_bar_charts(df=df_testing_avg_exp2, x_var='scaffolding_string:N', x_title='Scaffolding', x_labels=SCAFFOLDING_LABELS,
        #                             y_var='scaled_human_reward:Q', y_title=human_performance_title, title='Effects of Scaffolding on Human Performance', show_plot=show_plot, save_file='H3_objective_global.png')
        #
        # # plot interaction performance
        # plot_grouped_performance_bar_charts(df=df_testing_avg_exp2, x_var='scaffolding_string:N', x_labels=SCAFFOLDING_LABELS, x_title='Test difficulty', y_var='scaled_human_reward:Q', y_title=human_performance_title, col_var='test_difficulty_string:N', col_sort=TEST_DIFFICULTY_LABELS, plot_title='Interaction Effect between Scaffolding and Test Difficulty', legend_title='Scaffolding', show_plot=show_plot, save_file='H3_objective_interaction.png', scheme='viridis')


        # data = df_training_survey_avg_exp2
        # # data = df_training_survey_avg_exp2[df_training_survey_avg_exp2.opt_visuals == 1]
        # kruskal = pg.kruskal(dv='Q0', between='scaffolding', data=data)
        # print(kruskal)
        # kruskal = pg.kruskal(dv='Q1', between='scaffolding', data=data)
        # print(kruskal)
        # kruskal = pg.kruskal(dv='Q2', between='scaffolding', data=data)
        # print(kruskal)

        # # plot subjective bar chart
        # plot_subjective_bar_charts(df_training_survey_avg_exp2, subjective_x_axis, 'scaffolding_string:N', scaffolding_y_axis_label, SCAFFOLDING_LABELS, show_plot=show_plot, save_file='H3_subjective_raw.png')
        #
        #
        #############################################################################################################
        #
        #
        # print("\n==================== H4 ====================")
        #
        # data = df_testing_avg_exp2[(df_testing_avg_exp2.opt_visuals == 0)].scaled_human_reward
        # print(np.mean(data))
        # print(np.std(data))
        # data = df_testing_avg_exp2[(df_testing_avg_exp2.opt_visuals == 1)].scaled_human_reward
        # print(np.mean(data))
        # print(np.std(data))
        #
        # data = df_testing_avg_exp2
        # aov = pg.mixed_anova(dv='scaled_human_reward', within='test_difficulty', subject='uniqueid',
        #                      between='opt_visuals', data=data, correction=True)
        # print("p-val: {}, DOF effect: {}, DOF error: {}, F: {}".format(aov['p-unc'].values, aov['DF1'].values, aov['DF2'].values, aov['F'].values))
        # print(aov)
        # print(aov['p-unc'])
        # print(aov['p-GG-corr'])
        #
        # # exploring interaction effects
        # data = df_testing_avg_exp2[df_testing_avg_exp2.test_difficulty == 0]
        # pt = pg.pairwise_tukey(dv='scaled_human_reward', between='opt_visuals', data=data)
        # print(pt)
        # data = df_testing_avg_exp2[df_testing_avg_exp2.test_difficulty == 1]
        # pt = pg.pairwise_tukey(dv='scaled_human_reward', between='opt_visuals', data=data)
        # print(pt)
        # # statistically significant
        # data = df_testing_avg_exp2[df_testing_avg_exp2.test_difficulty == 2]
        # pt = pg.pairwise_tukey(dv='scaled_human_reward', between='opt_visuals', data=data)
        # print(pt)
        #
        # # subjective
        # data = df_training_survey_avg_exp2
        # print(np.median(data[data.opt_visuals == 0].Q0))
        # print(np.median(data[data.opt_visuals == 1].Q0))
        # mwu = pg.mwu(data[data.opt_visuals == 0].Q0, data[data.opt_visuals == 1].Q0)
        # print(mwu)
        # print(np.median(data[data.opt_visuals == 0].Q1))
        # print(np.median(data[data.opt_visuals == 1].Q1))
        # mwu = pg.mwu(data[data.opt_visuals == 0].Q1, data[data.opt_visuals == 1].Q1)
        # print(mwu)
        # print(np.median(data[data.opt_visuals == 0].Q2))
        # print(np.median(data[data.opt_visuals == 1].Q2))
        # mwu = pg.mwu(data[data.opt_visuals == 0].Q2, data[data.opt_visuals == 1].Q2)
        # print(mwu)


        # # plot global performance
        # plot_performance_bar_charts(df=df_testing_avg_exp2, y_var='scaled_human_reward:Q', y_title=human_performance_title,
        #                             x_var='opt_visuals_string:N', x_title='Optimized Visuals', x_labels=OPT_VISUALS_LABELS,
        #                             title='Effects of optimized visuals on human performance', show_plot=show_plot, save_file='H4_objective_global.png')
        #
        # # plot interaction performance
        # plot_grouped_performance_bar_charts(df=df_testing_avg_exp2, x_var='opt_visuals_string:N', x_labels=OPT_VISUALS_LABELS, x_title='Test Difficulty', y_var='scaled_human_reward:Q', y_title=human_performance_title, col_var='test_difficulty_string:N', col_sort=TEST_DIFFICULTY_LABELS, plot_title='Interaction effect between Optimized Visuals and Test Difficulty', legend_title='Optimized Visuals', show_plot=show_plot, save_file='H4_objective_interaction.png', scheme='darkred')


        # # plot subjective bar chart
        # plot_subjective_bar_charts(df_training_survey_avg_exp2, subjective_x_axis, 'opt_visuals_string:N', opt_visuals_y_axis_label, list(reversed(OPT_VISUALS_LABELS)), show_plot=show_plot, save_file='H4_subjective_raw.png')


        ################################ MISC ################################
        # print("\n========== PER PARTICIPANT CORRELATION ACROSS DOMAINS ==========")
        # corr = pg.intraclass_corr(data=df_testing, targets='uniqueid', raters='domain', ratings='scaled_human_reward')
        # print(corr)
        # print("ICC value: {}, p-val: {}".format(corr['ICC'][5], corr['pval'][5]))

        print("\n========== COHENS KAPPA ==========")
        # calculate cohen's kappa and raw overlap between the two codings of qualitative responses regarding learning styles
        coder1 = []
        coder2 = []
        # reading csv file
        with open('coding.csv', 'r') as csvfile:
            # creating a csv reader object
            csvreader = csv.reader(csvfile)

            # extracting each data row one by one
            for row in csvreader:
                coder1.append(row[2])
                coder2.append(row[3])

        score = cohen_kappa_score(coder1, coder2)
        print(score)

        # calculate raw overlap perfectage
        overlaps = [coder2[i] == val for i, val in enumerate(coder1)]
        overlap_percentage = overlaps.count(True) / len(coder1)
        print(overlap_percentage)

        # print("\n==================== QUALITATIVE RESPONSES ====================")
        # condition = 8
        # print("\n========== TRAINING DEMONSTRATION COMMENTS ==========")
        # if condition <= 2:
        #     print(df_training_survey_exp1[df_training_survey_exp1.condition == condition].undefined.values)
        # else:
        #     print(df_training_survey_exp2[df_training_survey_exp2.condition == condition].undefined.values)
        # print("\n========== POST SURVEY COMMENTS ==========")
        # print(df_post_survey[df_post_survey.condition == condition].Q0.values)


        # print("\n========== DESCRIPTIVE STATISTICS ==========")
        # obtain_test_demonstration_performance(df_testing_avg, ['condition'])


        # # only considering US2 for H1 (for HRI 2021 R4L workshop)
        # print("\n==================== H1 ====================")
        # print("\n========== ANOVA: TEST DEMONSTRATION PERFORMANCE ==========")
        # aov = pg.rm_anova(dv='scaled_human_reward', within=['test_difficulty'], subject='uniqueid',
        #                   data=df_testing_avg[df_testing_avg.condition > 2], correction=True)
        #
        # if ('p-GG-corr' in aov and aov['p-GG-corr'].iloc[0] < alpha) or (
        #         'p-GG-corr' not in aov and aov['p-unc'].iloc[0] < alpha):
        #
        #     print('Reject H0: different distributions. Perform post-hoc Tukey HSD.')
        #     try:
        #         print("Corrected p-val: {}, DOF effect: {}, DOF error: {}, F: {}".format(aov['p-GG-corr'][0], aov['ddof1'][0],
        #                                                                        aov['ddof2'][0], aov['F'][0]))
        #     except:
        #         print("Uncorrected p-val: {}, DOF effect: {}, DOF error: {}, F: {}".format(aov['p-unc'][0], aov['ddof1'][0],
        #                                                                        aov['ddof2'][0], aov['F'][0]))
        #
        #     print("\n========== TUKEY: TEST DEMONSTRATION PERFORMANCE ==========")
        #     data = df_testing_avg[df_testing_avg.condition > 2]
        #     pt = pg.pairwise_tukey(dv='scaled_human_reward', between='test_difficulty', data=data)
        #     print(pt)
        #
        # print("\n========== SPEARMAN CORRELATION: SUBJECTIVE  ==========")
        # # subjective
        # data = df_testing_avg[df_testing_avg.condition > 2]
        # corr = pg.corr(data.test_difficulty, data.likert_response, method="spearman")
        # if corr['p-val'][0] < alpha:
        #     print('Reject H0: Correlation between test difficulty and confidence.')
        #     print(corr)
