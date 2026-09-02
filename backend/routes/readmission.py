from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(
    prefix="/api/readmission",
    tags=["Readmission"]
)

@router.get("/stats")
def get_readmission_stats():
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # 1. Basic metrics (Unique patients & total predictions)
        cursor.execute("""
            WITH unique_members AS (
                SELECT 
                    HA.*,
                    ROW_NUMBER() OVER (PARTITION BY HA.Member_Number ORDER BY HA.PCP_Number) AS rnk
                FROM dbo._Hospital_Admission HA
            )
            SELECT 
                COUNT(Member_Number) AS number_of_patients,
                COUNT(Model_Admission_Status) AS total_predictions
            FROM unique_members
            WHERE rnk = 1
        """)

        row = cursor.fetchone()
        number_of_patients = int(row.number_of_patients or 0)
        total_predictions = int(row.total_predictions or 0)

        # 2. Risk categories
        cursor.execute("""
            SELECT
                Risk_Category,
                COUNT(*) AS total
            FROM dbo._Hospital_Admission
            WHERE Risk_Category IS NOT NULL
            GROUP BY Risk_Category
        """)

        risk_categories = {
            "High Risk": 0,
            "Medium Risk": 0,
            "Low Risk": 0
        }

        for row in cursor.fetchall():
            if row.Risk_Category:
                category = str(row.Risk_Category).strip()
                risk_categories[category] = int(row.total)

        # 3. Prediction accuracy
        cursor.execute("""
            SELECT
                COUNT(*) AS total_rows,
                SUM(
                    CASE
                        WHEN Prediction_Correct = 0 THEN 1
                        ELSE 0
                    END
                ) AS incorrect_count
            FROM dbo._Hospital_Admission
            WHERE Prediction_Correct IS NOT NULL
        """)

        row = cursor.fetchone()
        total_rows = int(row.total_rows or 0)
        incorrect_count = int(row.incorrect_count or 0)

        if total_rows > 0:
            error_percentage = round((incorrect_count / total_rows) * 100, 2)
            accuracy_percentage = round(100 - error_percentage, 2)
        else:
            error_percentage = 0.0
            accuracy_percentage = 100.0

        # 4. Prediction classification matrix results
        cursor.execute("""
            SELECT
                Prediction_Result,
                COUNT(*) AS total
            FROM dbo._Hospital_Admission
            WHERE Prediction_Result IS NOT NULL
            GROUP BY Prediction_Result
        """)

        prediction_results = {}
        for row in cursor.fetchall():
            result = str(row.Prediction_Result).strip()
            prediction_results[result] = int(row.total)

        # 5. Actual vs Predicted Admissions
        cursor.execute("""
            SELECT
                SUM(CASE WHEN Actual_Admission_Status = 'Admission' THEN 1 ELSE 0 END) AS actual_admissions,
                SUM(CASE WHEN Actual_Admission_Status = 'No Admission' THEN 1 ELSE 0 END) AS actual_no_admissions,
                SUM(CASE WHEN Model_Admission_Status = 'Admission' THEN 1 ELSE 0 END) AS predicted_admissions,
                SUM(CASE WHEN Model_Admission_Status = 'No Admission' THEN 1 ELSE 0 END) AS predicted_no_admissions
            FROM dbo._Hospital_Admission
        """)

        row = cursor.fetchone()
        admission_comparison = {
            "actual_admissions": int(row.actual_admissions or 0),
            "actual_no_admissions": int(row.actual_no_admissions or 0),
            "predicted_admissions": int(row.predicted_admissions or 0),
            "predicted_no_admissions": int(row.predicted_no_admissions or 0)
        }

        # 6. Gender distribution
        cursor.execute("""
            SELECT
                Gender,
                COUNT(*) AS total
            FROM dbo._Hospital_Admission
            WHERE Gender IS NOT NULL
            GROUP BY Gender
        """)

        gender_distribution = {}
        for row in cursor.fetchall():
            gender = str(row.Gender).strip()
            gender_distribution[gender] = int(row.total)

        return {
            "status": "success",
            "number_of_patients": number_of_patients,
            "total_predictions": total_predictions,
            "risk_categories": risk_categories,
            "error_percentage": error_percentage,
            "accuracy_percentage": accuracy_percentage,
            "prediction_results": prediction_results,
            "admission_comparison": admission_comparison,
            "gender_distribution": gender_distribution
        }

    except Exception as e:
        print("Database Error:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve readmission statistics: {str(e)}"
        )

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()