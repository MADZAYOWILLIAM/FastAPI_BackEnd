from passlib.context import CryptContext
import hashlib

pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # ALWAYS pre-hash
    sha256 = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return pwd_cxt.hash(sha256)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    sha256 = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return pwd_cxt.verify(sha256, hashed_password)
