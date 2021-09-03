const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  serviceAccount: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDftrHaP+HbE27z\ncJANl1wUEbYWJ7hYjIXL8309fPeaM1NKgUzmqyiWar3BbJQJpI/yyKaMtTLx78Fh\n/nTtgW2VDdz0C8pw96Tcz5USJUhxrJxiuOGwieAfzFmbVkUeQOtgtjuqy/VEL5aR\nCREqEJloIRoXaZTu9+ZG7xj8CwTXTe6zguatxaljqETgTk/Z59Vkpw2m+Tb5jVcP\nZOfyutiqxKWrmymbizj2sS9ZRKfHkjRXAOBL8fwx76zaFyqqLda/aKiYLYknxr17\nPl6zgG0gCjXyUC+f2RkKPYPdMU9B2GO7BO+cBl6FCZryRkBffxFpN1pTaWS5xuXv\nkCQfMFRNAgMBAAECggEABeGHdGLTMk9Po95U0x6kVjIO/4RvdVh1rfe1K6LM3toJ\njv8DgVmE2XYYjeynnvHwsiOx3ny8SEg9ZQZA7FDHi4W6m2nHRR1QJq6ITy/5Yw+e\nvtOjDzaDVKKqb7R0CwhkMlMoEg8xipIrsEgKPPkEZ2HeDePXJ/RkB9UCQEyehcsN\n58SXCyUCJ/dCiyzsThNpw7FLKDPmRZ38X2pDB7haZ60YBoOmi661QxSirwfSuweV\nGpRvkCseHuISiWSLHIJTKwX3Pt8+9szO3H12XHB2wy0G8cqHgKk4CDOI+SlMWV0u\nhNzf+d2nRa03W5TwjiOncg+2akMEC08TYRvJqv3pmwKBgQD+aKfGfjI11i63n2SY\nRVq+dX7OBJaE7NHFqmjVHG2BAcFmdl8wbmOafsTPo4D4I+4xjkGEMv8qEBxAKkQn\nkhtk2jl51LZtCs/RRmKcr/sW5sXrWhuaxVxOcOCqDCvScnIxOBLUAFr90nBzY22a\nlwnYVZgTykBV7AsDJbRGZZQM3wKBgQDhHORd0Rzt0sGRctH4UTTTHF7HknpM+sn7\noMXrdnoy4RTsmWiw1jDEBPpAtC2rAVTKkT4Jz7C6gX2f1SJCwhI+xvmy75LfFZfy\nuZo51+kDKh3pcS3TjlNhNZkBPRUDjzPkMlmgXUp5ll4PJQEYCfTAj5lcLz9Zy2m2\nCOlY0SzYUwKBgCHzgYBh0v2QScfDg782cje8omGIBzZSDGSeq0LVel+fBlpQLb/e\n23gAtu8m2M1ErkL6ww+LZrYMVFjTyyikvPcmkEkL9BR1PuqkxAA5E/8oaP1RlyF+\neSUWt0S6PxbkowyieRDFw17gOJWNjVD2GyA9u//YG+HbkFSpMXe7kphtAoGBAIBJ\nWsssNHRDuxQMfyQoAxacAFdzXkcoVJsVkDUTm6gLJUWAV20PY1MSExt0kuH1LEEU\nbGpi9bATw2emqpOozYUBF6Ola+m+AI3Ov9le9edbxRgX66m4XkPzq3JNQQB6R3Qw\nTWtaPurzij7PM8RjSBvEuf0S3+NoTKH0iiaXbhsJAoGAOxbfsAatUCppo3bOLHfp\nMT9OIZMd3wAYEcQzzgv7E/g5utlT7Q/5VQbzbNRjhA2BBzhTJMbJX2gJfLaLuJX8\nmtgLLmY8ZTo8OCZlFsPqtbAoKxhnKbSIopfX0icr9CvsvWnY0w3M+oBWfPdYy/YU\nNU59OgZIVFpb3X97fSW2KcQ=\n-----END PRIVATE KEY-----\n',
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CERT_URL,
  },
};
