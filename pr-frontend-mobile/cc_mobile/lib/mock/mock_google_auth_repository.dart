import 'package:google_sign_in/google_sign_in.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';
import '../repository/google_auth_repository.dart';



class MockGoogleAuthRepository implements GoogleAuthRepositoryInterface {
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'openid'],
    serverClientId: 'TU_CLIENT_ID_WEB.apps.googleusercontent.com',
  );

  final AuthService _authService;
  MockGoogleAuthRepository({required AuthService authService})
      : _authService = authService;

  /// Realiza el flujo completo de login con Google en Android:
  /// 1) Google SignIn para obtener [serverAuthCode].
  /// 2) Envía el [serverAuthCode] al backend para intercambiarlo por tokens.
  /// 3) Valida/transforma la respuesta en un [UserModel].
  @override
  Future<UserModel?> signInWithGoogle() async {
    // 1) Dispara la UI nativa y obtiene la cuenta de Google
    final account = await _googleSignIn.signIn();
    if (account == null) return null; // Usuario canceló

    // 2) Obtiene el código de autorización (serverAuthCode)
    final auth = await account.authentication;
    final String? code = auth.idToken;
    if (code == null) throw Exception('No se recibió serverAuthCode');
    print("token: $code");

    // 3) Intercambia ese code por tokens en el backend
    // final Tokens tokens = await _authService.exchangeCodeForTokens(code);

    // // 4) Opcional: guarda tu JWT interno o el refresh token
    // // await _saveJwt(tokens.idToken);
    // // await _saveRefreshToken(tokens.refreshToken);

    // // 5) Verifica/decodifica el idToken (si quieres extraer campos)
    // final userInfo = _parseIdToken(tokens.idToken);

    // 6) Crea o mapea tu UserModel
    return UserModel(
      id:    "10",
      email: "juanda",
      name:  "juanda",
      // cualquier otro campo...
    );
  }

  /// Decodifica el payload JWT para extraer claims
  // Map<String, dynamic> _parseIdToken(String idToken) {
  //   // Usa tu propia librería; aquí un ejemplo con jwt_decoder
  //   return JwtDecoder.decode(idToken);
  // }
}
