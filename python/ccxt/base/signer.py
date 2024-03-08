from base58 import b58encode, b58decode
from base64 import urlsafe_b64encode
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

class Signer(object):
    def __init__(
        self,
        account_id: str,
        private_key: str,
    ) -> None:
        self._account_id = account_id
        print(private_key)
        self._private_key = Ed25519PrivateKey.from_private_bytes(b58decode(private_key.split(":")[1]))
        print(self._private_key)

    def sign_request(self, message):
        return urlsafe_b64encode(
            self._private_key.sign(message.encode())
        ).decode("utf-8")


# def encode_key(key: bytes):
#     return "ed25519:%s" % b58encode(key).decode("utf-8")
