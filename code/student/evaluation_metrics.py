import numpy as np
import matplotlib.pyplot as plt

class RecommendationEvaluator:
    
    def __init__(self):
        pass
    
    def analyze_recommendations(self, uu_recommendations, ii_recommendations):
        uu_shows = set([show_name for _, _, show_name in uu_recommendations])
        ii_shows = set([show_name for _, _, show_name in ii_recommendations])
        overlap = uu_shows.intersection(ii_shows)
        
        print(f"User-User recommendations: {len(uu_shows)}")
        print(f"Item-Item recommendations: {len(ii_shows)}")
        print(f"Overlap: {len(overlap)}")
        print(f"Unique to User-User: {len(uu_shows - ii_shows)}")
        print(f"Unique to Item-Item: {len(ii_shows - uu_shows)}")
        
        if overlap:
            print("Common recommendations:")
            for show in overlap:
                print(f"  - {show}")
        
        return overlap
    
    def plot_scores(self, uu_recommendations, ii_recommendations):
        uu_scores = [score for _, score, _ in uu_recommendations]
        ii_scores = [score for _, score, _ in ii_recommendations]
        
        fig, axes = plt.subplots(1, 2, figsize=(15, 6))
        
        x = range(len(uu_scores))
        width = 0.35
        
        axes[0].bar([i - width/2 for i in x], uu_scores, width, label='User-User CF', color='skyblue')
        axes[0].bar([i + width/2 for i in x], ii_scores, width, label='Item-Item CF', color='lightcoral')
        axes[0].set_xlabel('Recommendation Rank')
        axes[0].set_ylabel('Score')
        axes[0].set_title('Top-5 Recommendation Scores')
        axes[0].legend()
        
        methods = ['User-User CF', 'Item-Item CF']
        max_scores = [max(uu_scores), max(ii_scores)]
        axes[1].bar(methods, max_scores, color=['skyblue', 'lightcoral'])
        axes[1].set_ylabel('Maximum Score')
        axes[1].set_title('Maximum Scores by Method')
        
        for i, score in enumerate(max_scores):
            axes[1].text(i, score + max(max_scores)*0.01, f'{score:.1f}', 
                        ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        plt.show()
    
    def validate_requirements(self, uu_max_score, ii_max_score):
        uu_pass = uu_max_score > 900
        ii_pass = ii_max_score > 31
        
        print(f"User-User CF max score: {uu_max_score:.2f} (requirement: > 900) {'✓' if uu_pass else '✗'}")
        print(f"Item-Item CF max score: {ii_max_score:.2f} (requirement: > 31) {'✓' if ii_pass else '✗'}")
        
        if uu_pass and ii_pass:
            print("All requirements passed!")
        else:
            print("Some requirements failed.")
        
        return uu_pass and ii_pass