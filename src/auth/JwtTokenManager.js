const Jwt = require('@hapi/jwt');

class JwtTokenManager {
  generateAccessToken(payload) {
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }
  generateRefreshToken(payload) {
    return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }
  verifyRefreshToken(token) {
    try {
      const artifacts = Jwt.token.decode(token);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      return artifacts.decoded.payload;
    } catch (error) {
      throw new Error('Refresh token tidak valid');
    }
  }
}

module.exports = JwtTokenManager;