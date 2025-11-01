import numpy as np

class SimilarityComputation:
    
    def compute_degree_matrices(self, R):
        m, n = R.shape
        # TODO: Implement this method
        user_degrees=np.sum(R, axis=1) #sum along rows
        P =np.diag(user_degrees)

        item_degrees= np.sum(R, axis=0)  #sum along columns
        Q=np.diag(item_degrees)
        
        return P, Q
    
    def compute_user_similarity_matrix(self, R, P):
        m = R.shape[0]

        # Su = P^(-1/2) * R * R^T * P^(-1/2)

        diag_p = np.diag(P).copy()
        diag_p[diag_p == 0] = 1.0 # fix possible division by zero
        inv_sqrt_diag_p = 1.0 / np.sqrt(diag_p)
        P_inv_sqrt = np.diag(inv_sqrt_diag_p)
        Su = P_inv_sqrt @ R @ R.T @ P_inv_sqrt
        
        return Su

    
    def compute_item_similarity_matrix(self, R, Q):
        n = R.shape[1]


        # Si = Q^(-1/2) * R^T * R * Q^(-1/2)

        diag_q = np.diag(Q).copy()
        diag_q[diag_q == 0] = 1.0
        inv_sqrt_diag_q = 1.0 / np.sqrt(diag_q)
        Q_inv_sqrt = np.diag(inv_sqrt_diag_q)
        Si = Q_inv_sqrt @ R.T @ R @ Q_inv_sqrt
        
        return Si