import 'package:google_sign_in/google_sign_in.dart';
import 'package:cc_mobile/models/user_model.dart';
import 'package:cc_mobile/repository/google_auth_repository.dart';


class MockGoogleAuthRepository  implements GoogleAuthRepositoryInterface {

  final GoogleSignIn _googleSignIn = GoogleSignIn(scopes: ['email', 'openid']);
  MockGoogleAuthRepository();
 

  //METHODS 
  @override
  Future<UserModel?> signInWithGoogle() async {
    try {
      final account = await _googleSignIn.signIn();
      if (account == null) return null;

      print('Cuenta de Google: ${account}');
    
      final auth = await account.authentication;
      final idToken = auth.idToken;
      print('Autenticación de Google: ${auth}');
      print('ID Token: $idToken');
      
      if (idToken == null) throw Exception('Falta idToken');

      await Future.delayed(Duration(seconds: 1)); // Simula un retraso de red

      return UserModel(
        id:"1",
        name:"Juan Da",
        email: "jupalaciosf"

      );
    } catch (e) {
      print('Error en GoogleAuthRepository: $e');
      rethrow;
    }
  }


}