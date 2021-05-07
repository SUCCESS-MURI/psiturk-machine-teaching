# User Study on Machine Teaching

Run ``python herokuapp.py`` to run the user study locally. You must have [psiturk](https://psiturk.org/) installed, and the study must be completed on a laptop or desktop on one of the following browsers: Chrome, Firefox, or Safari.

Videos of training demonstrations reside in static/vid/{k0, k1, ..., k7_k8_k2}, while videos of testing demonstrations reside in static/vid/testing/{low, medium, high}. You may navigate to these directories and directly view the videos without running the user study.

dfs_processed_masked.pickle contains the user study data, which can be analyzed using data_analysis.py. The pickle file contains the data for the 54 participants from the first user study (conditions 0-2), and the 108 participants from the second user study (conditions 3-8).

Coding of qualitative participant responses with learning styles can be found in coding.csv.

This repository contains raw code that has not gone extensive cleanup. If you have any questions, please contact the primary author at ml5@andrew.cmu.edu.
