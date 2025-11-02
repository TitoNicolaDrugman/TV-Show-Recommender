# TV Show Recommender System

![alt text](visualization.gif)


This repository contains the implementation of a TV show recommender system based on collaborative filtering algorithms. The project was developed for the CIE6006/MCE5918 Data Analytics course at The Chinese University of Hong Kong. Shenzhen. It explores both user-user and item-item collaborative filtering approaches to generate personalized TV show recommendations.

## Table of Contents
- [Project Overview](#project-overview)
- [Core Concepts](#core-concepts)
- [Implementation Details](#implementation-details)
- [Key Findings](#key-findings)
- [File Structure](#file-structure)
- [3D Visualization](#3d-visualization)

## Project Overview

The main objective of this project is to build and evaluate a recommendation system using a real-world dataset of TV show viewing habits. The system analyzes a dataset of **9,985 users** and **563 TV shows** to predict which shows a user might like.

The core tasks of the project include:
-   **Data Processing**: Loading and analyzing a user-show interaction matrix.
-   **Collaborative Filtering**: Implementing both user-user and item-item collaborative filtering algorithms.
-   **Similarity Matrix Calculation**: Using cosine similarity to determine the relationships between users and between TV shows.
-   **Recommendation Generation**: Generating top-5 TV show recommendations for a specific target user ("Alex", user ID 499).
-   **Evaluation**: Analyzing and comparing the performance of the two collaborative filtering methods.

## Core Concepts

The recommendation engine is built upon the principle of **collaborative filtering**, which makes predictions by collecting preferences from many users. The core metric used to measure similarity is **Cosine Similarity**.

### 1. Cosine Similarity
Cosine similarity measures the cosine of the angle between two non-zero vectors. In this project, it is used to calculate:
-   **User Similarity (Su)**: Similarity between two users based on the shows they have watched.
-   **Item Similarity (Si)**: Similarity between two TV shows based on the users who have watched them.

The matrix-based formulas for these are:
-   **User Similarity**: `Su = P^(-1/2) * R * R^T * P^(-1/2)`
-   **Item Similarity**: `Si = Q^(-1/2) * R^T * R * Q^(-1/2)`

Where `R` is the user-item ratings matrix, and `P` and `Q` are the diagonal degree matrices for users and items, respectively.

### 2. Collaborative Filtering Models
-   **User-User Collaborative Filtering**: Recommends items by finding users with similar tastes. It predicts a user's preference for a show based on the ratings of "neighboring" users.
    -   **Recommendation Matrix**: `Γ = Su * R`
-   **Item-Item Collaborative Filtering**: Recommends items that are similar to other items the user has liked. It identifies relationships between shows and suggests those with the highest similarity scores.
    -   **Recommendation Matrix**: `Γ = R * Si`

## Implementation Details

The project was implemented in Python, primarily using the following libraries:
-   **NumPy**: For efficient numerical computations and matrix operations.
-   **Pandas**: For data manipulation and analysis.
-   **Scikit-learn**: As a baseline to verify the correctness of the custom cosine similarity implementation.

Key numerical considerations during implementation included:
-   **Handling Zero Divisions**: To avoid division-by-zero errors for users with no viewing history or shows with no viewers, degrees of zero were replaced with a value of 1.0. This prevents numerical errors without affecting valid similarity scores.
-   **Sparse vs. Dense Matrices**: Although the dataset is sparse (86.5% sparsity), standard dense NumPy arrays were used. The performance was sufficient for the given data size, but for larger datasets, a specialized sparse matrix library (like `scipy.sparse`) would be more optimal.

## Key Findings

The analysis of the recommendation output for the target user "Alex" (ID 499) revealed several insights:

-   **High Agreement Between Models**: Both user-user and item-item models produced highly similar recommendations, with a 4 out of 5 overlap in the top-5 list. This suggests that the recommended shows are robustly good choices.
-   **Different Score Scales**: The recommendation scores from the user-user model were significantly larger than those from the item-item model. This is because user-user scores are an aggregation of similarity values from thousands of users, while item-item scores are weighted only by the target user's own binary ratings.
-   **Performance with a Different User (User 3)**: A quantitative evaluation using Precision@5 and Recall@5 on a different user (User 3) showed that the **Item-Item model performed significantly better**, correctly rediscovering 2 out of 3 relevant shows. In contrast, the User-User model failed to find any. This highlights that the effectiveness of a collaborative filtering approach can be highly user-dependent.

### Top 5 Recommendations for "Alex" (User 499)

| Rank | User-User Recommendation | Score | Item-Item Recommendation | Score |
| :--: | :--- | :---: | :--- | :---: |
| 1 | FOX 28 News at 10pm | 908.48 | FOX 28 News at 10pm | 31.36 |
| 2 | Family Guy | 861.18 | Family Guy | 30.00 |
| 3 | 2009 NCAA Basketball Tournament | 827.60 | NBC 4 at Eleven | 29.40 |
| 4 | NBC 4 at Eleven | 784.78 | 2009 NCAA Basketball Tournament | 29.23 |
| 5 | Two and a Half Men | 757.60 | Access Hollywood | 28.97 |

## File Structure

The repository is organized as follows:

```
.
├── code/
│   ├── student/
│   │   ├── TVShowsRecommendation.ipynb  # Main Jupyter Notebook for analysis.
│   │   ├── tv_recommendation.py         # Core recommendation engine logic.
│   │   ├── similarity_computation.py    # Functions for computing similarity matrices.
│   │   ├── evaluation_metrics.py        # Functions for evaluating recommendations.
│   │   ├── data/
│   │   │   ├── shows.txt                # List of TV show names.
│   │   │   └── user-shows.txt           # The user-item interaction matrix data.
│   │   └── tv-show-visualizer/          # Files for the 3D visualization.
│   │       ├── index.html
│   │       └── main.js
├── CIE_6006___Data_Analytics_Assignment_2.pdf # The final project report.
└── README.md
```

## 3D Visualization

As an extension to the core project, an interactive 3D visualization of the user and item similarity spaces was created using dimensionality reduction. This tool helps to intuitively explore the relationships discovered by the collaborative filtering models.

The visualization allows you to:
-   **Select a user** to inspect their taste profile.
-   View the **TV shows a user has watched** (represented by yellow lines).
-   See the **Top-5 recommended shows** for the target user "Alex" (highlighted in green with magenta lines).

**The visualization is hosted online and can be accessed here:** [Interactive 3D Visualization](https://titonicoladrugman.github.io/TV-Show-Recommender/code/student/tv-show-visualizer/)
