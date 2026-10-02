import sqlite3

conn = sqlite3.connect("careerpath.db")
conn.row_factory = sqlite3.Row

rows = conn.execute("""
    SELECT *
    FROM assessment_results
""").fetchall()

for row in rows:
    print(dict(row))

conn.close()