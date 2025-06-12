from pydantic import BaseModel

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
    correction_count: int  # ✅ 필수

class AmplifyResponse(BaseModel):
    next_level: int
    success: bool
    protection_used: bool
    cost: int
    message: str
    destroyed: bool
