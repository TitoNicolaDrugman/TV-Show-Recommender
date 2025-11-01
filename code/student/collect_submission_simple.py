STUDENT_ID = "your_student_id"

import os
import zipfile
import subprocess
import sys

print(f"Preparing submission for Student ID: {STUDENT_ID}")

CODE_FILES = [
    'similarity_computation.py',
    'tv_recommendation.py', 
    'evaluation_metrics.py',
    'TVShowsRecommendation.ipynb'
]

CODE_ZIP_NAME = 'a3_code_submission.zip'
INLINE_PDF_NAME = 'a3_inline_submission.pdf'

missing_files = []
found_files = []

for file in CODE_FILES:
    if os.path.exists(file):
        print(f"Found: {file}")
        found_files.append(file)
    else:
        print(f"Missing: {file}")
        missing_files.append(file)

if not missing_files:
    with zipfile.ZipFile(CODE_ZIP_NAME, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in found_files:
            zipf.write(file)
            print(f"Added: {file}")
    print(f"Created {CODE_ZIP_NAME}")

if os.path.exists('TVShowsRecommendation.ipynb'):
    try:
        print("Converting notebook to PDF...")
        subprocess.run([
            'jupyter', 'nbconvert', 
            '--to', 'pdf',
            'TVShowsRecommendation.ipynb',
            '--output', INLINE_PDF_NAME.replace('.pdf', '')
        ], check=True)
        print(f"Created {INLINE_PDF_NAME}")
        
    except FileNotFoundError:
        print("Error: Jupyter not found. Please install: pip install jupyter nbconvert")
        sys.exit(1)
        
    except subprocess.CalledProcessError:
        print("Error: PDF conversion failed. Please check your notebook has outputs.")
        sys.exit(1)

print(f"\nSubmission files created:")
print(f"✓ {CODE_ZIP_NAME}")
print(f"✓ {INLINE_PDF_NAME}")
print(f"\nStudent ID: {STUDENT_ID}")
print("Submission complete!")