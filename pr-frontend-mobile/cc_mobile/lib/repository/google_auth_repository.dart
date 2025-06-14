import 'package:google_sign_in/google_sign_in.dart';
import 'package:cc_mobile/services/auth_service.dart';
import 'package:cc_mobile/models/user_model.dart';
import 'package:cc_mobile/utils/secure_storage.dart';

abstract class GoogleAuthRepositoryInterface {
  Future<UserModel?> signInWithGoogle();
  Future<bool> hasRegisterToken(); // útil para saber si el siguiente paso es registro
  Future<bool> registerUser({
    required String email,
    required String username,
  }); // para registrar usuario tras obtener register_token
  Future<void> clearRegisterToken(); // para limpiar el token tras registro
}

class GoogleAuthRepository extends GoogleAuthRepositoryInterface {
  final AuthService _authService;
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'openid'],
    serverClientId: '414832951377-d9t6vqebm0ov63njffrga981ooie637n.apps.googleusercontent.com',
  );

  GoogleAuthRepository({ AuthService? authService}) : _authService = authService ?? AuthService();

  @override
  Future<UserModel?> signInWithGoogle() async {
    try {
      final account = await _googleSignIn.signIn();
      if (account == null) return null;

      final String? code = account.serverAuthCode;
      if (code == null) throw Exception('No se recibió serverAuthCode');

      final responseData = await _authService.authenticateInBackend(code);

      

      if (responseData.containsKey('jwt')) {

        print('RESPONSE DATA: $responseData');
        final user = UserModel.fromJson(responseData['user']);
        final jwt = responseData['jwt'];
        await SecureStorage.instance.write(key: 'jwt', value: jwt);

        print('USERRRRR EN REPOSITORY: ${user.name}');
        return user;
      } else if (responseData.containsKey('register_token')) {
        final registerToken = responseData['register_token'];
        await SecureStorage.instance.write(key: 'register_token', value: registerToken);
        // No hay usuario aún, debe completar registro
        return null;
      } else {
        throw Exception('Respuesta inesperada del servidor');
      }
    } catch (e) {
      print('Error en GoogleAuthRepository: $e');
      rethrow;
    }
  }

  @override
  Future<bool> registerUser({
    required String email,
    required String username,
  }) async {
    try {
      final registerToken = await SecureStorage.instance.read(key: 'register_token');
      if (registerToken == null) {
        throw Exception('No se encontró register_token');
      }

      final response = await _authService.registerUserInBackend(
        email: email,
        username: username,
        registerToken: registerToken,
      );

      if (response['ok'] == true) {
        // Se espera que backend setee cookie JWT, pero por si acaso:
        if (response.containsKey('jwt')) {
          await SecureStorage.instance.write(key: 'jwt', value: response['jwt']);
        }

        // Limpiar datos temporales
        await SecureStorage.instance.delete(key: 'register_token');
        await SecureStorage.instance.delete(key: 'register_email');
        return true;
      } else {
        return false;
      }
    } catch (e) {
      print('Error en registro de usuario: $e');
      rethrow;
    }
  }



  @override
  Future<bool> hasRegisterToken() async {
    final token = await SecureStorage.instance.read(key: 'register_token');
    return token != null;
  }

  @override
  Future<void> clearRegisterToken() async {
    await SecureStorage.instance.delete(key: 'register_token');
  }
}
