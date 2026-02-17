import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

olympic_df = pd.read_csv('athlete_events.csv')

sns.set_style("whitegrid")

plt.figure(figsize=(10, 6))
sns.histplot(data=olympic_df, x='Age', bins=40)
plt.title('Distribution of Olympic Medal Athletes Age', fontsize=16, fontweight='bold')
plt.xlabel('Age', fontsize=12)
plt.tight_layout()
plt.savefig('hist-seaborn.png')

plt.figure(figsize=(10, 6))
sns.boxplot(data=olympic_df, y=olympic_df['Height'] / 30.48)
plt.title('Distribution of Olympic Medal Athletes Height', fontsize=16, fontweight='bold')
plt.ylabel('Height (ft)', fontsize=12)
plt.tight_layout()
plt.savefig('box-seaborn.png')


plt.figure(figsize=(10, 6))
sns.stripplot(data=olympic_df, y=olympic_df['Weight'] * 2.205, jitter=True, alpha=0.3)
plt.title('Distribution of Olympic Medal Athletes Weight', fontsize=16, fontweight='bold')
plt.ylabel('Weight (lb)', fontsize=12)
plt.tight_layout()
plt.savefig('strip-seaborn.png')

print(olympic_df['Age'].max())