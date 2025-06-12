from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from logic import amplify

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AmplifyRequest(BaseModel):
    amplify_type: str
    item_type: str
    current_level: int
    use_protection: bool
    use_harmony: bool
    use_conflict: bool
    harmony_price: int
    conflict_price: int
    protection_price: int
    correction_count: int  # ✅ 추가됨

@app.post("/amplify")
def amplify_route(data: AmplifyRequest):
    result = amplify(
        amplify_type=data.amplify_type,
        item_type=data.item_type,
        current_level=data.current_level,
        use_protection=data.use_protection,
        use_harmony=data.use_harmony,
        use_conflict=data.use_conflict,
        harmony_price=data.harmony_price,
        conflict_price=data.conflict_price,
        protection_price=data.protection_price,
        correction_count=data.correction_count  # ✅ 추가됨
    )
    return result
