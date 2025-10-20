import sqlite3
import pandas as pd

# File paths
DB_FILE = "walmart.db"
SHEET0 = "shipping_data_0.xlsx"
SHEET1 = "shipping_data_1.xlsx"
SHEET2 = "shipping_data_2.xlsx"

# Connect to SQLite
conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

# --------------------------
# Insert spreadsheet 0
# --------------------------
def insert_sheet0():
    df0 = pd.read_excel(SHEET0)
    df0.to_sql("shipping_data_0", conn, if_exists="append", index=False)
    print(f"Inserted {len(df0)} rows from sheet 0")

# --------------------------
# Insert spreadsheets 1 + 2
# --------------------------
def insert_sheet1_and_2():
    df1 = pd.read_excel(SHEET1)
    df2 = pd.read_excel(SHEET2)
    
    # Merge on shipment_identifier
    merged = pd.merge(df1, df2, on="shipment_identifier")
    
    # Group products per shipment_identifier
    for shipment_id, group in merged.groupby("shipment_identifier"):
        origin = group["origin"].iloc[0]
        destination = group["destination"].iloc[0]
        
        for _, row in group.iterrows():
            product = row["product"]
            quantity = row["quantity"]
            
            cursor.execute("""
                INSERT INTO shipments (shipment_identifier, origin, destination, product, quantity)
                VALUES (?, ?, ?, ?, ?)
            """, (shipment_id, origin, destination, product, quantity))
    
    print(f"Inserted {len(merged)} product rows from sheet 1+2")

# --------------------------
# Main
# --------------------------
if __name__ == "__main__":
    insert_sheet0()
    insert_sheet1_and_2()
    conn.commit()
    conn.close()
    print("Database population complete.")
