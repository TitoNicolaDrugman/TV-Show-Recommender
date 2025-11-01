import numpy as np
from similarity_computation import SimilarityComputation

class TVRecommendationEngine:
    
    def __init__(self):
        self.sim_computer = SimilarityComputation()
        self.R = None
        self.show_names = None
        self.P = None
        self.Q = None
        
    def load_data(self, user_shows_path, shows_path):
        self.R = np.loadtxt(user_shows_path, dtype=int)
        with open(shows_path, 'r', encoding='utf-8') as f:
            self.show_names = [line.strip() for line in f.readlines()]
        
    def preprocess_data(self):
        self.P, self.Q = self.sim_computer.compute_degree_matrices(self.R)
        
    def user_user_collaborative_filtering(self, user_idx, missing_indices):
        Su =self.sim_computer.compute_user_similarity_matrix(self.R,self.P) # compute su
        alex_sim_vector = Su[user_idx, :]   
        alex_scores = alex_sim_vector @ self.R
        
        return alex_scores # uu_score
    
    def item_item_collaborative_filtering(self, user_idx, missing_indices):
        Si=self.sim_computer.compute_item_similarity_matrix(self.R,self.Q) # compute si
        gamma= self.R @ Si
        alex_scores=gamma[user_idx, :]

        return alex_scores
    
    def get_top_recommendations(self, scores, candidate_indices, top_k=5):
        candidate_scores = [(idx, scores[idx]) for idx in candidate_indices]
        candidate_scores.sort(key=lambda x: (-x[1], x[0]))
        top_items = []
        for i in range(min(top_k, len(candidate_scores))):
            item_idx, score = candidate_scores[i]
            show_name = self.show_names[item_idx]
            top_items.append((item_idx, score, show_name))
        return top_items