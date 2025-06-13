import 'package:google_sign_in/google_sign_in.dart';
import 'package:cc_mobile/services/auth_service.dart';
import 'package:cc_mobile/models/user_model.dart';
import 'package:cc_mobile/utils/secure_storage.dart';


abstract class GoogleAuthRepositoryInterface {
 
  Future<UserModel?> signInWithGoogle();
}

class GoogleAuthRepository extends GoogleAuthRepositoryInterface {
  final AuthService _authService;
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'openid'],
    serverClientId: '414832951377-d9t6vqebm0ov63njffrga981ooie637n.apps.googleusercontent.com',
  );

  //CONSTRUCTOR
  GoogleAuthRepository({required AuthService authService}) : _authService = authService;
 

  //METHODS 
  @override
  Future<UserModel?> signInWithGoogle() async {
    try {
      final account = await _googleSignIn.signIn();
      if (account == null) return null;
      
      final String? code = account.serverAuthCode;
      if (code == null) throw Exception('No se recibió serverAuthCode');
      final responseData = await _authService.authenticateInBackend(code);

     
      final user = UserModel.fromJson(responseData['user']);
      
      final jwt = responseData['jwt'];
      await SecureStorage.instance.write(key: 'jwt', value: jwt);

      return user;
    } catch (e) {
      print('Error en GoogleAuthRepository: $e');
      rethrow;
    }
  }
}
