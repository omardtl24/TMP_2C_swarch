import 'package:google_sign_in/google_sign_in.dart';
import 'package:cc_mobile/services/auth_service.dart';
import 'package:cc_mobile/models/user_model.dart';


abstract class GoogleAuthRepositoryInterface {
 
  Future<UserModel?> signInWithGoogle();
}

class GoogleAuthRepository extends GoogleAuthRepositoryInterface {
  final AuthService _authService;
  final GoogleSignIn _googleSignIn = GoogleSignIn(scopes: ['email', 'openid']);
  GoogleAuthRepository({required AuthService authService}) : _authService = authService;
 

  //METHODS 
  @override
  Future<UserModel?> signInWithGoogle() async {
    try {
      final account = await _googleSignIn.signIn();
      if (account == null) return null;

      final auth = await account.authentication;
      final idToken = auth.idToken;
      if (idToken == null) throw Exception('Falta idToken');

      final responseData = await _authService.authenticateInBackend(idToken);
      
      // Transforma el JSON en un modelo de dominio
      final user = UserModel.fromJson(responseData['user']);

      // Aquí podrías también guardar el JWT si es necesario
      final jwt = responseData['token'];
      // guardarJWT(jwt); // si lo manejas así

      return user;
    } catch (e) {
      print('Error en GoogleAuthRepository: $e');
      rethrow;
    }
  }
}
