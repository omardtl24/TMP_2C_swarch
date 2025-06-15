import 'package:google_sign_in/google_sign_in.dart';
import 'package:cc_mobile/dataSource/auth_data_source.dart';
import 'package:cc_mobile/models/user_model.dart';
import 'package:cc_mobile/utils/secure_storage.dart';
import 'package:cc_mobile/models/response.dart';

abstract class GoogleAuthRepositoryInterface {
  Future<Response<UserModel>> signInWithGoogle();
  Future<Response<bool>> hasRegisterToken();
  Future<Response<bool>> registerUser({
    required String email,
    required String username,
  });
  Future<void> clearRegisterToken();
}

class GoogleAuthRepository extends GoogleAuthRepositoryInterface {
  final AuthDataSource _authDataSource;
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'openid'],
    serverClientId: '414832951377-d9t6vqebm0ov63njffrga981ooie637n.apps.googleusercontent.com',
  );

  GoogleAuthRepository({ AuthDataSource? authDataSource}) : _authDataSource = authDataSource ?? AuthDataSource();

  @override
  Future<Response<UserModel>> signInWithGoogle() async {
    try {
      final account = await _googleSignIn.signIn();
      if (account == null) {
        return Response.error('Inicio de sesión cancelado por el usuario');
      }

      final String? code = account.serverAuthCode;
      if (code == null) {
        return Response.error('No se recibió el código de autenticación');
      }

      final responseData = await _authDataSource.authenticateInBackend(code);
      
      if (responseData.containsKey('jwt')) {
        print('RESPONSE DATA: $responseData');
        final user = UserModel.fromJson(responseData['user']);
        final jwt = responseData['jwt'];
        await SecureStorage.instance.write(key: 'jwt', value: jwt);

        return Response.success(user);
      } else if (responseData.containsKey('register_token')) {
        final registerToken = responseData['register_token'];
        await SecureStorage.instance.write(key: 'register_token', value: registerToken);
        return Response.error('Se requiere registro');
      } else {
        return Response.error('Respuesta inesperada del servidor');
      }
    } catch (e) {
      print('Error en GoogleAuthRepository: $e');
      return Response.error('Error de conexión: ${e.toString()}');
    }
  }

  @override
  Future<Response<bool>> registerUser({
    required String email,
    required String username,
  }) async {
    try {
      final registerToken = await SecureStorage.instance.read(key: 'register_token');
      if (registerToken == null) {
        return Response.error('No se encontró token de registro');
      }
      print('Token de registro: $registerToken');
      final response = await _authDataSource.registerUserInBackend(
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
        return Response.success(true);
      } else {
        String errorMsg = 'Error en el registro';
        if (response.containsKey('message')) {
          errorMsg = response['message'];
        }
        return Response.error(errorMsg);
      }
    } catch (e) {
      print('Error en registro de usuario: $e');
      return Response.error('Error al procesar el registro: ${e.toString()}');
    }
  }

  @override
  Future<Response<bool>> hasRegisterToken() async {
    try {
      final token = await SecureStorage.instance.read(key: 'register_token');
      return Response.success(token != null);
    } catch (e) {
      print('Error al verificar token de registro: $e');
      return Response.error('Error al verificar estado de registro');
    }
  }

  @override
  Future<void> clearRegisterToken() async {
    await SecureStorage.instance.delete(key: 'register_token');
  }

  Future<void> logOut() async {
    try {
      await _googleSignIn.signOut();
      await SecureStorage.instance.delete(key: 'jwt');
      await SecureStorage.instance.delete(key: 'register_token');
      await SecureStorage.instance.delete(key: 'register_email');
    } catch (e) {
      print('Error al cerrar sesión: $e');
    }
  }

}
