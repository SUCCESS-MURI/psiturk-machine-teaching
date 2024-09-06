# User Study on Machine Teaching

This repository contains code for methods described in the following [paper](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2021.693050/full): 

- Michael S. Lee, Henny Admoni, Reid Simmons **Machine Teaching for Human Inverse Reinforcement Learning**, Frontiers in Robotics and AI, 2021,

which introduces a method for teaching robot decision making to humans through demonstrations of the robot's key decisions in a domain. 

We model humans as inverse reinforcement leaners to calculate information gain for possible demonstrations that could be shown, but further bias the demonstration selection for human understanding using various principles from education and cognitive science such as scaffolding, simplicity, and pattern recognition.

This user study tests whether incorporating demonstrations that incorporate the aforementioned principles of scaffolding, simplicity, and pattern recognition improve humans' ability to predict robot behavior in new situations over demonstrations that only optimize for information gain.

Please find additional information and follow-on work at https://symikelee.github.io/.

## Running the user study

Run ``python herokuapp.py`` to run the user study locally. You must have [psiturk](https://psiturk.org/) installed, and the study must be completed on a laptop or desktop on one of the following browsers: Chrome, Firefox, or Safari. Please note that this code has only been tested with Python 3.8 and Psiturk version 3.1.0 (which can be configured using a package manager such as [conda](https://docs.conda.io/en/latest/)).

Videos of teaching demonstrations reside in `static/vid/{k0, k1, ..., k7_k8_k2}`, while videos of testing demonstrations reside in `static/vid/testing/{low, medium, high}`. You may navigate to these directories and directly view the videos without running the user study. k0-k8 correspond to conditions 0-8 respectively across the two user studies. 

k0, k1, and k2 vary the between-subjects variable of *information class* across three levels: low, medium, and maximum, respectively. k3, k4, and k5 vary the between-subjects variable of *scaffolding* across the levels of none, forward, and backward, respectively, while keeping the between subjects-variable of *visual optimization* as negative. k6, k7, and k8 also vary the between-subjects variable of *scaffolding* across the levels of none, forward, and backward, respectively, but keep the between subjects-variable of *visual optimization* as positive. k4 and k5 are grouped in the same folder as they show the same demonstrations, only in opposite scaffolding order (the videos are labeled in order of forward scaffolding). k7 and k8 are grouped together for the same reason. Finally, k2 is grouped with k7 and k8 since these two conditions already include the maximum information demonstrations, and k2 could simply reuse these demonstrations (these are marked with a lack of a letter designation e.g. skateboard_4.mp4).

## Data analysis

`dfs_processed_masked.pickle` contains the user study data, which can be analyzed using `data_analysis.py`. The pickle file contains the data for the 54 participants from the first user study (conditions 0-2), and the 108 participants from the second user study (conditions 3-8).

Coding of qualitative participant responses with learning styles can be found in `coding.csv`.
