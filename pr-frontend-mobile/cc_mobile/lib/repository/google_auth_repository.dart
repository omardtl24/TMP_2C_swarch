import 'package:google_sign_in/google_sign_in.dart';
import 'package:cc_mobile/services/auth_service.dart';
import 'package:cc_mobile/models/user_model.dart';
import 'package:cc_mobile/utils/secure_storage.dart';
import 'package:cc_mobile/models/auth_response.dart';

abstract class GoogleAuthRepositoryInterface {
  Future<AuthResponse<UserModel>> signInWithGoogle();
  Future<AuthResponse<bool>> hasRegisterToken();
  Future<AuthResponse<bool>> registerUser({
    required String email,
    required String username,
  });
  Future<void> clearRegisterToken();
}

class GoogleAuthRepository extends GoogleAuthRepositoryInterface {
  final AuthService _authService;
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'openid'],
    serverClientId: '414832951377-d9t6vqebm0ov63njffrga981ooie637n.apps.googleusercontent.com',
  );

  GoogleAuthRepository({ AuthService? authService}) : _authService = authService ?? AuthService();

  @override
  Future<AuthResponse<UserModel>> signInWithGoogle() async {
    try {
      final account = await _googleSignIn.signIn();
      if (account == null) {
        return AuthResponse.error('Inicio de sesión cancelado por el usuario');
      }

      final String? code = account.serverAuthCode;
      if (code == null) {
        return AuthResponse.error('No se recibió el código de autenticación');
      }

      final responseData = await _authService.authenticateInBackend(code);
      
      if (responseData.containsKey('jwsst')) {
        print('RESPONSE DATA: $responseData');
        final user = UserModel.fromJson(responseData['user']);
        final jwt = responseData['jwt'];
        await SecureStorage.instance.write(key: 'jwt', value: jwt);

        return AuthResponse.success(user);
      } else if (responseData.containsKey('register_tokenss')) {
        final registerToken = responseData['register_token'];
        await SecureStorage.instance.write(key: 'register_token', value: registerToken);
        return AuthResponse.error('Se requiere registro');
      } else {
        return AuthResponse.error('Respuesta inesperada del servidor');
      }
    } catch (e) {
      print('Error en GoogleAuthRepository: $e');
      return AuthResponse.error('Error de conexión: ${e.toString()}');
    }
  }

  @override
  Future<AuthResponse<bool>> registerUser({
    required String email,
    required String username,
  }) async {
    try {
      final registerToken = await SecureStorage.instance.read(key: 'register_token');
      if (registerToken == null) {
        return AuthResponse.error('No se encontró token de registro');
      }
      print('Token de registro: $registerToken');
      final response = await _authService.registerUserInBackend(
        email: email,
        username: username,
        registerToken: registerToken,
      );
      print('Response del registroOOOOOOOOOO: $response');
      if (response['status'] == "success") {
        if (response.containsKey('jwt')) {
          await SecureStorage.instance.write(key: 'jwt', value: response['jwt']);
        }
        
        await SecureStorage.instance.delete(key: 'register_token');
        await SecureStorage.instance.delete(key: 'register_email');
        return AuthResponse.success(true);
      } else {
        String errorMsg = 'Error en el registro';
        if (response.containsKey('message')) {
          errorMsg = response['message'];
        }
        return AuthResponse.error(errorMsg);
      }
    } catch (e) {
      print('Error en registro de usuario: $e');
      return AuthResponse.error('Error al procesar el registro: ${e.toString()}');
    }
  }

  @override
  Future<AuthResponse<bool>> hasRegisterToken() async {
    try {
      final token = await SecureStorage.instance.read(key: 'register_token');
      return AuthResponse.success(token != null);
    } catch (e) {
      print('Error al verificar token de registro: $e');
      return AuthResponse.error('Error al verificar estado de registro');
    }
  }

  @override
  Future<void> clearRegisterToken() async {
    await SecureStorage.instance.delete(key: 'register_token');
  }
}
